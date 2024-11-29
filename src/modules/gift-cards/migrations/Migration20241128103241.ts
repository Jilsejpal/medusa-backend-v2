import { Migration } from '@mikro-orm/migrations';

export class Migration20241128103241 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "gift-cards" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "gift-cards_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_gift-cards_deleted_at" ON "gift-cards" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "gift-cards" cascade;');
  }

}
