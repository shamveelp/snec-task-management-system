import { IsString, IsOptional } from 'class-validator';

export class UpdateOrganizationSettingsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  mobile?: string;
}
