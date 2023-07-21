import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Users } from 'src/database/entities/auth/Users';
import { createQueryBuilder } from 'typeorm';

@ValidatorConstraint({ async: true })
export class UsernameNotRegisteredConstraint
  implements ValidatorConstraintInterface {
  async validate(username: string) {
    if (!username) {
      return false;
    }
    const user = await createQueryBuilder(Users)
      .where({
        username: username,
      })
      .getOne();

    if (user) {
      return false;
    }

    return true;
  }
}

export function UsernameNotRegistered(validationOptions: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'UsernameNotRegistered',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: UsernameNotRegisteredConstraint,
    });
  };
}
