import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Users } from 'src/database/entities/auth/Users';
import { createQueryBuilder } from 'typeorm';

@ValidatorConstraint({ async: true })
export class PhoneNumberNotRegisteredConstraint
  implements ValidatorConstraintInterface {
  async validate(phonenumber: string) {
    if (!phonenumber) {
      return false
    }
    const user = await createQueryBuilder(Users)
      .where({
        phonenumber: phonenumber,
      })
      .getOne();

    if (user) {
      return false;
    }

    return true;
  }
}

export function PhoneNumberNotRegistered(validationOptions: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'PhoneNumberNotRegistered',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: PhoneNumberNotRegisteredConstraint,
    });
  };
}
