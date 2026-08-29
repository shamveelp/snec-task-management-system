export interface BaseServiceInterface<T, CreateDto, UpdateDto> {
  findAll(query?: any, page?: number, limit?: number): Promise<{ data: T[]; meta: any }>;
  findById(id: string): Promise<T>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  remove(id: string): Promise<any>;
}
