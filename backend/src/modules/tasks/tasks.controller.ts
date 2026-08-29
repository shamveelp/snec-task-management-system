import { Controller, Get, Post, Body, Param, Put, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { CreateTaskDto, UpdateTaskDto } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Req() req, @Body() data: CreateTaskDto) {
    const userRole = req.user.role?.name; // Organization Role
    return this.tasksService.createTask(req.user.id, userRole, data);
  }

  @Get('project/:projectId')
  async getTasksByProject(@Param('projectId') projectId: string) {
    return this.tasksService.getTasksByProject(projectId);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Put(':id')
  async updateTask(@Req() req, @Param('id') id: string, @Body() data: UpdateTaskDto) {
    const userRole = req.user.role?.name;
    return this.tasksService.updateTask(id, req.user.id, userRole, data);
  }

  @Post(':id/comments')
  async addComment(@Req() req, @Param('id') id: string, @Body() body: { content: string }) {
    return this.tasksService.addComment(id, req.user.id, body.content);
  }
}
