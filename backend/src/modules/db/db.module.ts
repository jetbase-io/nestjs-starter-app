import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UsernameUnique} from "../users/validator/user-unique.validator";
import {entities} from "./db.provider";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature(entities)
  ],
  providers: [UsernameUnique]
})
export class DbModule {}
