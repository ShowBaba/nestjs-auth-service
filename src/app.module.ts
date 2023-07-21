import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'
import { AppController } from './app.contoller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ORMConfig from 'ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { RawSQLRunnerService } from './raw-sql-runner.service';
import { UsersModule } from './modules/users/users.module';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(ORMConfig),
    CacheModule.register({ isGlobal: true })
  ],
  providers: [RawSQLRunnerService]
})
export class AppModule {}
