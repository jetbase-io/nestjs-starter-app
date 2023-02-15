import { MigrationInterface, QueryRunner } from 'typeorm';

export class initSchema1668071320859 implements MigrationInterface {
  name = 'initSchema1668071320859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "internalComment" character varying(300), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('User', 'Admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "internalComment" character varying(300), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "customerStripeId" character varying, "subscriptionId" character varying, "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'User', "avatar" character varying NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "expired_access_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "internalComment" character varying(300), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_04259d7ed505a721a81f74a07ab" UNIQUE ("token"), CONSTRAINT "PK_10798a01b70c12c8fada80fe3fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "internalComment" character varying(300), "title" character varying NOT NULL, "stripePriceId" character varying NOT NULL, CONSTRAINT "UQ_b668f86e99301be2d56e0c9aa4e" UNIQUE ("title"), CONSTRAINT "UQ_b671aaeeecb098232ba628bf2e6" UNIQUE ("stripePriceId"), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expired_access_tokens" ADD CONSTRAINT "FK_dd214c76e3544048c4dd4f29ca4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expired_access_tokens" DROP CONSTRAINT "FK_dd214c76e3544048c4dd4f29ca4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(`DROP TABLE "plans"`);
    await queryRunner.query(`DROP TABLE "expired_access_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
