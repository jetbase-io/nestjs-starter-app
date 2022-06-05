import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';

interface Config {
  JWT_SECRET: string;
}

const CONFIG_KEYS = ['JWT_SECRET'];

const OPTIONAL_KEYS = new Set([]);

@Injectable()
export class ConfigService {
  public config: Config;

  constructor() {
    const conf = existsSync(
      resolve(process.cwd(), `.${process.env.NODE_ENV}.env`),
    )
      ? parse(
          readFileSync(resolve(process.cwd(), `.${process.env.NODE_ENV}.env`)),
        )
      : `.${process.env.NODE_ENV}.env`;

    this.config = CONFIG_KEYS.reduce((acc, key) => {
      if (!conf[key] && !OPTIONAL_KEYS.has(key)) {
        throw new Error(`Env variable ${key} is not defined`);
      }
      acc[key] = conf[key];
      return acc;
    }, {} as Config);
  }
}
