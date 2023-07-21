import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async mailUser(payload: {
    to: string,
    subject: string,
    emailData: Record<string, any>,
    emailTemplate: string,
  }) {
    try {
      // TODO: implement a mailing service
      return 
    } catch (e) {
      console.log(e, "error that occured")
    }
  }
}
