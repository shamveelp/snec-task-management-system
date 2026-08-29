import { plainToInstance } from 'class-transformer';
import { AdminOrganizationResponseDto } from './dtos/admin-organization-response.dto';
import { Injectable } from '@nestjs/common';
import { AdminOrganizationRepository } from './admin-organization.repository';

@Injectable()
export class AdminOrganizationService {
  constructor(private readonly organizationRepository: AdminOrganizationRepository) {}

  async getOrganizations(query?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [orgs, total] = await Promise.all([
      this.organizationRepository.findAll({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.organizationRepository.count({ where })
    ]);

    return {
      data: orgs.map(org => plainToInstance(AdminOrganizationResponseDto, org, { excludeExtraneousValues: true })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
