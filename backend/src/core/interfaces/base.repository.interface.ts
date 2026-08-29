export interface BaseRepositoryInterface<T, CreateDto, UpdateDto> {
  findAll(args?: any): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(args: any): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<T>;
  count(args?: any): Promise<number>;
}
