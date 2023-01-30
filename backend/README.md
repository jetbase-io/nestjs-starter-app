## Description

Nest JS project starter

## Installation

### Local Deploy

#### Setup environment
```bash
$ cp .env.sample .env
```

#### Install Dependencies
```bash
$ npm install
```

#### Create DB and a role for it
Setup Postgres if you didn't do it yet

Create a role and DB
```bash
psql -U postgres
create user nest_react_saas password 'nest_react_saas_pass';
create database nest_react_saas_db owner 'nest_react_saas';
\c nest_react_saas_db
create extension if not exists "uuid-ossp";
\q

```

Run migrations and seed
```bash
npm run publish-migration
npm run seed

```

## Running the app

```bash
# development
$ npm run start:dev

# run init-schema migration
$ npm run publish-migration

# run seeds 
$ npm run seed
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
