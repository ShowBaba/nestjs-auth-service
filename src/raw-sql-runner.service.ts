// raw-sql-runner.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class RawSQLRunnerService implements OnModuleInit {
  constructor(private readonly connection: Connection) { }

  async onModuleInit() {
    try {
      const query1 = `
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      username VARCHAR(255),
      phonenumber VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      firstname VARCHAR(255),
      lastname VARCHAR(255),
      profilepicture TEXT,
      isverified BOOLEAN DEFAULT FALSE,
      created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      deleted TIMESTAMP WITH TIME ZONE
    );`
    

      const query3 = `
    CREATE TABLE IF NOT EXISTS error_logs (
      id SERIAL PRIMARY KEY,
      source VARCHAR(255),
      userid VARCHAR(255),
      message TEXT,
      stack TEXT,
      created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      deleted TIMESTAMP WITH TIME ZONE
    );
    `

      await this.connection.query(query1);
      await this.connection.query(query3);

      console.log('Raw SQL queries executed successfully.');
    } catch (error) {
      console.error('Error executing raw SQL queries:', error.message);
    }
  }
}
