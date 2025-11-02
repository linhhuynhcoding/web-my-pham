CREATE TABLE "account" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "type" varchar(30) NOT NULL, -- TODO: create account_type relationship
  "balance" bigint DEFAULT 0,
  "currency" varchar(10) DEFAULT 'VND', -- TODO: create currency relationship
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "purpose" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text
);

CREATE TABLE "spend_type" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text
);

CREATE TABLE "spend" (
  "id" BIGSERIAL PRIMARY KEY,
  "type_id" int NOT NULL,
  "title" varchar(50) NOT NULL,
  "amount" bigint NOT NULL,
  "account_id" bigint NOT NULL,
  "purpose_id" bigint,
  "notes" text,
  "date" timestamp NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "spend_tag" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "spend_tag_map" (
  "spend_id" bigint,
  "tag_id" bigint,
  PRIMARY KEY (spend_id,tag_id)
);

CREATE TABLE "income_type" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text
);

CREATE TABLE "income" (
  "id" BIGSERIAL PRIMARY KEY,
  "type_id" int NOT NULL,
  "title" varchar(50) NOT NULL,
  "amount" bigint NOT NULL,
  "account_id" bigint NOT NULL,
  "purpose_id" bigint,
  "notes" text,
  "date" timestamp NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "income_tag" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "income_tag_map" (
  "income_id" bigint,
  "tag_id" bigint,
  PRIMARY KEY (income_id,tag_id)
);

CREATE TABLE "transfer" (
  "id" BIGSERIAL PRIMARY KEY,
  "from_account_id" bigint NOT NULL,
  "to_account_id" bigint NOT NULL,
  "amount" bigint NOT NULL,
  "notes" text,
  "date" timestamp NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

ALTER TABLE "spend" ADD FOREIGN KEY ("type_id") REFERENCES "spend_type" ("id");

ALTER TABLE "spend" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "spend" ADD FOREIGN KEY ("purpose_id") REFERENCES "purpose" ("id");

ALTER TABLE "spend_tag_map" ADD FOREIGN KEY ("spend_id") REFERENCES "spend" ("id");

ALTER TABLE "spend_tag_map" ADD FOREIGN KEY ("tag_id") REFERENCES "spend_tag" ("id");

ALTER TABLE "income" ADD FOREIGN KEY ("type_id") REFERENCES "income_type" ("id");

ALTER TABLE "income" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

ALTER TABLE "income" ADD FOREIGN KEY ("purpose_id") REFERENCES "purpose" ("id");

ALTER TABLE "income_tag_map" ADD FOREIGN KEY ("income_id") REFERENCES "income" ("id");

ALTER TABLE "income_tag_map" ADD FOREIGN KEY ("tag_id") REFERENCES "income_tag" ("id");

ALTER TABLE "transfer" ADD FOREIGN KEY ("from_account_id") REFERENCES "account" ("id");

ALTER TABLE "transfer" ADD FOREIGN KEY ("to_account_id") REFERENCES "account" ("id");
