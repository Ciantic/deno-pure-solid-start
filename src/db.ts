"use server";

import { Database as Sqlite } from "@db/sqlite";
import { DenoSqlite3Dialect } from '@soapbox/kysely-deno-sqlite';

import fs from "node:fs";
import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
    SqliteDialect,
    Kysely,
    sql,
} from "kysely";

const SCHEMA = sql`
  -- sqlite3

  CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  -- Trigger to update updatedAt column
  CREATE TRIGGER IF NOT EXISTS update_pages_updatedAt
  AFTER UPDATE ON pages
  FOR EACH ROW
  BEGIN
      UPDATE pages
      SET updatedAt = CURRENT_TIMESTAMP
      WHERE id = OLD.id;
  END;

  -- INSERT INTO pages (title, body, createdAt, updatedAt)
  -- VALUES ('Hello, World!', 'This is the first page.', datetime('now'), datetime('now'));
`;

interface PageTable {
    id: Generated<number>;
    title: string;
    body: string;
    createdAt: ColumnType<Date, never, never>;
    updatedAt: ColumnType<Date, never, never>;
}

// export type Page = Selectable<PageTable>;
// export type InsertPage = Insertable<PageTable>;
// export type UpdatePage = Updateable<PageTable>;

export type Database = {
    pages: PageTable;
};

// const sqliteDb = new Sqlite("db.sqlite");
// const kyselyDb = new Kysely({
//     dialect: new DenoSqlite3Dialect({
//         database: new Sqlite("db.sqlite"),
//     }),
// });
const sqliteDb = new Sqlite("db.sqlite");
const kyselyDb = new Kysely<Database>({
    dialect: new DenoSqlite3Dialect({
        database: sqliteDb,
    }),
    log: ["query"],
});

export async function createDb(drop = false) {
    // Delete database file if drop is true
    if (drop) {
        if (fs.existsSync("db.sqlite")) {
            try {
                // Note: deleting file causes locking issues in Windows, it is easier to
                // truncate
                fs.truncateSync("db.sqlite");
            } catch (e) {
                console.error(e);
            }
        }
        sqliteDb.exec(SCHEMA.compile(kyselyDb).sql);

        // await db.schema.createTable("pages")
        //   .addColumn("id", "integer", (f) => f.autoIncrement().primaryKey())
        //   .addColumn("title", "text")
        //   .addColumn("body", "text")
        //   .addColumn("createdAt", "text")
        //   .addColumn("updatedAt", "text")
        //   // .addPrimaryKeyConstraint("id", ["id"])
        //   .execute();
    }
}

export function db() {
    return kyselyDb;
}

export function getPages() {
  "use server";
  // await new Promise((resolve) => setTimeout(resolve, 5000));
    return db().selectFrom("pages").selectAll().execute();
};

export function insertPage() {
    "use server";
    return db().insertInto("pages").values({
        title: "Hello, World!",
        body: "This is the first page.",
    }).execute();
}