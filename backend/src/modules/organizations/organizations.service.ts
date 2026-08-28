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
    return this.prisma.role.findMany({
      where: {
        name: {
          in: ['Developer', 'Project Manager', 'Team Lead']
        }
      },
      select: {
        id: true,
        name: true,
      }
    });
  }
}
