import { Injectable, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RegisterOrganizationDto } from './dto/register-organization.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return !user;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const org = await this.prisma.organization.findUnique({
      where: { email },
    });
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !org && !user;
  }

  async sendOtp(email: string) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minutes expiry

    // Save or update OTP in database
    await this.prisma.otp.upsert({
      where: { email },
      update: { otp, expiresAt, createdAt: new Date() },
      create: { email, otp, expiresAt },
    });

    // Send email
    await this.emailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent successfully' };
  }

  async registerOrganization(dto: RegisterOrganizationDto) {
    const { name, username, email, mobile, category, password, otp } = dto;

    if (!(await this.isUsernameAvailable(username))) {
      throw new ConflictException('Username already taken');
    }

    if (!(await this.isEmailAvailable(email))) {
      throw new ConflictException('Email already registered');
    }

    // Verify OTP
    const storedOtp = await this.prisma.otp.findUnique({ where: { email } });
    if (!storedOtp) {
      throw new BadRequestException('No OTP requested for this email');
    }
    
    if (storedOtp.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (storedOtp.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Hash password
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    try {
      // Find or create 'Organization Admin' role
      let role = await this.prisma.role.findUnique({
        where: { name: 'Organization Admin' },
      });

      if (!role) {
        role = await this.prisma.role.create({
          data: {
            name: 'Organization Admin',
            description: 'Administrator for an organization',
          },
        });
      }

      // Create Organization and User in a transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        const organization = await prisma.organization.create({
          data: {
            name,
            email,
            mobile,
            category,
          },
        });

        const user = await prisma.user.create({
          data: {
            name: name, // Using org name as user name
            username,
            email,
            password: hashedPassword,
            mobile,
            roleId: role.id,
            organizationId: organization.id,
          },
        });

        // Delete the used OTP
        await prisma.otp.delete({ where: { email } });

        return { organization, user };
      });

      return { 
        message: 'Organization registered successfully', 
        organizationId: result.organization.id,
        userId: result.user.id
      };
    } catch (error) {
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async getJoinedOrganizations(organizationId: string | null) {
    if (!organizationId) {
      return [];
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!org) return [];

    return [{
      id: org.id,
      name: org.name,
      category: org.category,
      memberCount: org._count.users,
      createdAt: org.createdAt
    }];
  }

  async getMembers(organizationId: string) {
    const users = await this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        role: {
          select: { name: true }
        }
      }
    });
    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role?.name,
      status: u.status,
    }));
  }

  async getInvitations(organizationId: string) {
    const invitations = await this.prisma.invitation.findMany({
      where: { organizationId },
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
    return invitations.map(i => ({
      id: i.id,
      email: i.email,
      role: i.role?.name,
      status: i.status,
      createdAt: i.createdAt,
    }));
  }

  async getRoles() {
    // Ensure a single "Member" role exists for org-level
    let memberRole = await this.prisma.role.findFirst({
      where: { name: 'Member' },
      select: { id: true, name: true },
    });
    if (!memberRole) {
      memberRole = await this.prisma.role.create({
        data: { name: 'Member', description: 'Organization member' },
        select: { id: true, name: true },
      });
    }
    return [memberRole];
  }
  async searchDevelopers(query: string, currentOrganizationId: string) {
    if (!query || query.length < 2) return [];
    
    // We want to find users who have the role "Developer", "Project Manager", or "Team Lead"
    // and who are NOT already in this organization
    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { email: { contains: query, mode: 'insensitive' } },
              { username: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ]
          },
          {
            OR: [
              { organizationId: null },
              { organizationId: { not: currentOrganizationId } }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: {
          select: { name: true }
        }
      },
      take: 5
    });

    return users.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role?.name
    }));
  }

  async getOrganizationNotifications(organizationId: string) {
    // Fetch recent activities across the organization
    
    // 1. New Projects
    const projects = await this.prisma.project.findMany({
      where: { organizationId },
      include: { createdBy: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // 2. New Tasks
    const tasks = await this.prisma.task.findMany({
      where: { project: { organizationId } },
      include: { reporter: true, project: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // 3. New Comments
    const comments = await this.prisma.taskComment.findMany({
      where: { task: { project: { organizationId } } },
      include: { user: true, task: { include: { project: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // 4. New Attachments
    const attachments = await this.prisma.taskAttachment.findMany({
      where: { task: { project: { organizationId } } },
      include: { user: true, task: { include: { project: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // 5. New Members
    const members = await this.prisma.user.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const notifications = [
      ...projects.map(p => ({ id: `proj_${p.id}`, type: 'PROJECT_CREATED', title: `Project created: ${p.name}`, user: { name: p.createdBy.name, profilePicture: p.createdBy.profilePicture }, createdAt: p.createdAt, metadata: { projectId: p.id, projectName: p.name } })),
      ...tasks.map(t => ({ id: `task_${t.id}`, type: 'TASK_CREATED', title: `Task created: ${t.title}`, user: { name: t.reporter.name, profilePicture: t.reporter.profilePicture }, createdAt: t.createdAt, metadata: { projectId: t.projectId, projectName: t.project.name, taskId: t.id, taskTitle: t.title } })),
      ...comments.map(c => ({ id: `comment_${c.id}`, type: 'COMMENT_ADDED', title: `New comment on: ${c.task.title}`, description: c.content, user: { name: c.user.name, profilePicture: c.user.profilePicture }, createdAt: c.createdAt, metadata: { projectId: c.task.projectId, projectName: c.task.project.name, taskId: c.taskId, taskTitle: c.task.title } })),
      ...attachments.map(a => ({ id: `attachment_${a.id}`, type: 'ATTACHMENT_UPLOADED', title: `Attachment added to: ${a.task.title}`, description: a.fileName, user: { name: a.user.name, profilePicture: a.user.profilePicture }, createdAt: a.createdAt, metadata: { projectId: a.task.projectId, projectName: a.task.project.name, taskId: a.taskId, taskTitle: a.task.title } })),
      ...members.map(m => ({ id: `member_${m.id}`, type: 'MEMBER_JOINED', title: `New member joined: ${m.name}`, user: { name: m.name, profilePicture: m.profilePicture }, createdAt: m.createdAt }))
    ];

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 50);
  }
}
