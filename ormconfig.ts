const migrationDir = process.env.DEV_SEED === 'true' ? 'seeders' : 'migrations';

const database = {
  development: process.env.DATABASE_DATABASE || 'mvpngn_development',
  test: process.env.DATABASE_DATABASE_TEST || 'mvpngn_test',
  production: process.env.DATABASE_DATABASE || 'mvpngn_production',
};

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || +'5432',
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'secret',
  database: database[process.env.NODE_ENV || 'development'],
  entities: [process.env.SEED_ENTITY_PATH || 'dist/**/*.entity{.ts,.js}'],
  migrationRun: false,
  synchronize: true,
  autoLoadEntities: true,
  logging: false,
  migrationsTableName: 'migrations',
  migrations: [__dirname + `/modules/db/${migrationDir}/*{.ts,.js}`],
  cli: {
    entitiesDir: 'src/*/',
    migrationsDir: __dirname + `/src/modules/db/${migrationDir}`,
  },
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
        rejectUnauthorized: false,
      }
      : false,
};
