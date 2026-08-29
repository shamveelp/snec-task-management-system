import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ProjectsService } from '../../organization/projects-management/projects.service';

@UseGuards(JwtAuthGuard)
@Controller('user/projects')
export class UserProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('me')
  async getMyProjects(@Req() req) {
    return this.projectsService.getProjectsByUser(req.user.id);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }
}
