import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 200 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 200 }).notNull().unique(),
});

export default usersTable;
