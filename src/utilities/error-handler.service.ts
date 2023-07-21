import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorLogs } from "../database/entities/errors/ErrorLogs"; 
import { Repository } from 'typeorm';

export class ErrorHandler {
    constructor(
        @InjectRepository(ErrorLogs) private errorLogsRepo:  Repository<ErrorLogs>
    ) {}

    async handle(payload: {
        error: any
        entity: string
        source: string,
        userid?: string
    }) {
      await this.errorLogsRepo.save({
          source: payload.source,
          message: payload.error?  payload.error.message : `Empty message`,
          stack: payload.error ? payload.error.stack : `Empty stack`,
          userid: payload.userid || null
      });
      throw new HttpException(
        {
          status: payload.error ? payload.error.status : HttpStatus.INTERNAL_SERVER_ERROR,
          message: payload.error? payload.error.message : `Something went terribly wrong. You might need Tech Support for this...`,
        },
        payload.error ? payload.error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}