import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Users } from 'src/database/entities/auth/Users';
import { createQueryBuilder } from 'typeorm';

@ValidatorConstraint({ async: true })
export class EmailNotRegisteredConstraint
  implements ValidatorConstraintInterface {
  async validate(email: string, args: ValidationArguments) {
    if (!email) {
      return false
    }
    const user = await createQueryBuilder(Users)
      .where({
        email,
      })
      .getOne();

    if (user) {
      return false;
    }

    return true;
  }
}

export function EmailNotRegistered(validationOptions: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'EmailNotRegistered',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: EmailNotRegisteredConstraint,
    });
  };
}
