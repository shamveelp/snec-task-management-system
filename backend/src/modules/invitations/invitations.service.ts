import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createInvitation(organizationId: string, email: string, roleId: string) {
    // 1. Verify organization exists
    const org = await this.prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) throw new NotFoundException('Organization not found');

    // 2. Verify role exists and is allowed (Developer, Project Manager, Team Lead)
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');
    const allowedRoles = ['Developer', 'Project Manager', 'Team Lead'];
    if (!allowedRoles.includes(role.name)) {
      throw new BadRequestException('Can only invite as Developer, Project Manager, or Team Lead');
    }

    // 3. Check if user is already in this organization
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.organizationId === organizationId) {
      throw new ConflictException('User is already a member of this organization');
    }

    // 4. Create or update invitation
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Delete existing pending invitation for this email and org if exists
    await this.prisma.invitation.deleteMany({
      where: { email, organizationId, status: 'PENDING' },
    });

    const invitation = await this.prisma.invitation.create({
      data: {
        email,
        roleId,
        organizationId,
        token,
        expiresAt,
      },
    });

    // 5. Send email
    const inviteLink = `http://localhost:3000/invite/${token}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>You've been invited!</h2>
        <p>You have been invited to join <strong>${org.name}</strong> as a <strong>${role.name}</strong>.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
        <p>This link will expire in 7 days.</p>
      </div>
    `;

    await this.emailService.sendEmail({
      to: email,
      subject: `Invitation to join ${org.name} on SNEC Task Management`,
      html: emailHtml,
    });

    return invitation;
  }

  async getInvitation(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: true,
        role: true,
      },
    });

    if (!invitation) throw new NotFoundException('Invitation not found');
    if (invitation.status !== 'PENDING') throw new BadRequestException('Invitation is no longer pending');
    if (invitation.expiresAt < new Date()) throw new BadRequestException('Invitation has expired');

    return {
      email: invitation.email,
      organizationName: invitation.organization.name,
      roleName: invitation.role.name,
      status: invitation.status,
    };
  }

  async acceptInvitation(token: string, userId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) throw new NotFoundException('Invitation not found');
    if (invitation.status !== 'PENDING') throw new BadRequestException('Invitation is no longer pending');
    if (invitation.expiresAt < new Date()) throw new BadRequestException('Invitation has expired');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    if (user.email !== invitation.email) {
      throw new BadRequestException('User email does not match invitation email');
    }

    // Accept invitation and attach user to organization
    await this.prisma.$transaction([
      this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          organizationId: invitation.organizationId,
          roleId: invitation.roleId,
        },
      }),
    ]);

    return { message: 'Invitation accepted successfully' };
  }

  async getMyInvitations(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const invitations = await this.prisma.invitation.findMany({
      where: { email: user.email, status: 'PENDING' },
      include: {
        organization: { select: { id: true, name: true, category: true } },
        role: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map(i => ({
      id: i.id,
      token: i.token,
      organizationName: i.organization.name,
      organizationCategory: i.organization.category,
      roleName: i.role.name,
      createdAt: i.createdAt,
      expiresAt: i.expiresAt,
    }));
  }
}
