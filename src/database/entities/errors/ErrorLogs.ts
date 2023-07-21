import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../Base';
@Entity({
  name: 'error_logs',
})
export class ErrorLogs extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userid: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'text', nullable: true })
  stack: string;
}
