import { Injectable } from '@nestjs/common';
import { BaseRepositoryInterface } from '../interfaces/base.repository.interface';

@Injectable()
export abstract class BaseRepository<T, CreateDto, UpdateDto> implements BaseRepositoryInterface<T, CreateDto, UpdateDto> {
  
  constructor(protected readonly model: any) {}

  async findAll(args?: any): Promise<T[]> {
    return this.model.findMany(args);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findOne(args: any): Promise<T | null> {
    return this.model.findFirst(args);
  }

  async create(data: CreateDto): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async count(args?: any): Promise<number> {
    return this.model.count(args);
  }
}
