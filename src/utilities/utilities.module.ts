import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLogs } from 'src/database/entities/errors/ErrorLogs';
import { EmailService } from './email.service';
import { ErrorHandler } from './error-handler.service';
import { UtilitiesService } from './utilities.service';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorLogs])],
  providers: [UtilitiesService,  ErrorHandler, EmailService],
  exports: [
    UtilitiesService,
    ErrorHandler,
    EmailService,
  ],
})
export class UtilitiesModule {}
