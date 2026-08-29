import { Controller, Get, Post, Delete, Body, Param, Put, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from './tasks.service';
import type { CreateTaskDto, UpdateTaskDto } from './tasks.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@UseGuards(JwtAuthGuard)
@Controller('organization/tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  async createTask(@Req() req, @Body() data: CreateTaskDto) {
    const userRole = req.user.role?.name;
    return this.tasksService.createTask(req.user.id, userRole, data);
  }

  @Get('me')
  async getMyTasks(@Req() req) {
    return this.tasksService.getMyTasks(req.user.id);
  }

  @Get('project/:projectId')
  async getTasksByProject(@Param('projectId') projectId: string) {
    return this.tasksService.getTasksByProject(projectId);
  }

  @Get('project/:projectId/my-role')
  async getMyProjectRole(@Req() req, @Param('projectId') projectId: string) {
    const userRole = req.user.role?.name;
    const role = await this.tasksService.getUserProjectRole(projectId, req.user.id, userRole);
    return { role };
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

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  async addAttachment(@Req() req, @Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);
    return this.tasksService.addAttachment(id, req.user.id, result.secure_url, file.originalname, file.size);
  }

  @Delete('attachments/:attachmentId')
  async deleteAttachment(@Req() req, @Param('attachmentId') attachmentId: string) {
    return this.tasksService.deleteAttachment(attachmentId, req.user.id);
  }
}
