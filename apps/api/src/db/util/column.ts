import { createId } from "@paralleldrive/cuid2";
import { text, timestamp } from "drizzle-orm/pg-core";

export const cuidPrimaryKey = (columnName: string = "id") => {
  return text(columnName)
    .$defaultFn(() => createId())
    .primaryKey();
};

export const createdAt = (columnName: string = "created_at") =>
  timestamp(columnName).defaultNow().notNull();

export const updatedAt = (columnName: string = "updated_at") =>
  timestamp(columnName)
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull();
