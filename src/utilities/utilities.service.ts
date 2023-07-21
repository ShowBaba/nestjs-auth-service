import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
  generatePIN(length: number): string {
    let result = '';
    const characters = '123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  datediff(first: Date, second: Date) {
    return Math.round(
      (second.getTime() - first.getTime()) / (1000 * 60),
    );
  }
}