import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import type { CreateProjectDto, UpdateProjectDto } from './projects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ProjectRole } from '@prisma/client';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin', 'Project Manager')
  @Post()
  async createProject(@Req() req, @Body() data: CreateProjectDto) {
    const organizationId = req.user.organizationId;
    return this.projectsService.createProject(organizationId, req.user.id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin')
  @Get('organization')
  async getOrganizationProjects(@Req() req) {
    const organizationId = req.user.organizationId;
    return this.projectsService.getProjectsByOrganization(organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProjects(@Req() req) {
    return this.projectsService.getProjectsByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin', 'Project Manager')
  @Put(':id')
  async updateProject(@Param('id') id: string, @Body() data: UpdateProjectDto) {
    return this.projectsService.updateProject(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin', 'Project Manager')
  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role: ProjectRole },
  ) {
    return this.projectsService.addProjectMember(id, body.userId, body.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin', 'Project Manager')
  @Put(':id/members/:userId')
  async updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { role: ProjectRole },
  ) {
    return this.projectsService.updateMemberRole(id, userId, body.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin', 'Project Manager')
  @Delete(':id/members/:userId')
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectsService.removeMember(id, userId);
  }
}
