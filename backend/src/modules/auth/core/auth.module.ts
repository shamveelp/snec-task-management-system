import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';
import { PrismaAuthRepository } from './prisma-auth.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { DatabaseModule } from '../../../database/database.module';
import { EmailModule } from '../../email/email.module';

import { AuditLogsModule } from '../../organization/audit-logs/audit-logs.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({}),
    EmailModule,
    AuditLogsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    {
      provide: 'IAuthRepository',
      useClass: PrismaAuthRepository,
    },
  ],
  exports: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
