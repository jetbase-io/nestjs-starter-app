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

##### Create a role and development DB
```bash
psql -U postgres
create user nest_react_saas password 'nest_react_saas_pass';
create database nest_react_saas_db owner 'nest_react_saas';
\c nest_react_saas_db
create extension if not exists "uuid-ossp";
\q

```

##### Create test DB
```bash
psql -U postgres
create database test_nest_react_saas_db owner 'nest_react_saas';
\c test_nest_react_saas_db
create extension if not exists "uuid-ossp";
\q

```

#### Stripe Integration Guide

This guide will help you set up a Stripe account, generate the necessary API keys, and configure them for use in application.

#### 1. Create a Stripe Account

1. **Sign Up / Log In to Stripe:**
   - Go to [Stripe's website](https://stripe.com).
   - If you don't have an account, click on the **Sign Up** button and complete the registration process.
   - If you already have an account, click on **Sign In** and log in.

2. **Verify Your Email:**
   - After registration, Stripe will send a verification email to the address you provided. Make sure to verify your email.

3. **Complete the Setup:**
   - Follow the prompts to complete your account setup, including entering your business details and linking your bank account.

#### 2. Generate API Keys

1. **Access the Dashboard:**
   - Once logged in, navigate to the [Stripe Dashboard](https://dashboard.stripe.com).

2. **Navigate to the API Keys Section:**
   - In the left sidebar, click on **Developers** > **API keys**.

3. **Generate the Keys:**
   - You'll see two keys:
     - **Publishable Key**: Used on the client-side (e.g., in your front-end code).
     - **Secret Key**: Used on the server-side (e.g., in your back-end code).
   - By default, Stripe provides you with a **Test Mode** key pair, which you can use for development and testing.
   - Copy the **Secret Key** (e.g., `sk_test_...`) for use in your application.

#### 3. Configure Your Application

1. **Set Up Environment Variables:**
   - In your project root, locate or create a `.env` file.
   - Add the following lines to your `.env` file, replacing `your_secret_key` with the Stripe Secret Key you copied:

     ```env
     STRIPE_SECRET_KEY=your_secret_key
     ```

##### Run migrations and seed for development DB
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
