/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, BeforeUpdate, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../Base';

@Entity({
  name: 'users',
})
export class Users extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  phonenumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true, })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastname: string;

  @Column({ type: 'text', nullable: true })
  profilepicture: string;

  @Column({ type: 'boolean', default: false })
  isverified: boolean;


  // Triggers
  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
