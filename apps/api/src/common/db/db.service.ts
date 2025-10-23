import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Configuration } from "src/config/configuration";
import * as schema from "./schema";

@Injectable()
export class DbService {
  readonly drizzle: NodePgDatabase<typeof schema>;

  constructor(private readonly configService: ConfigService<Configuration>) {
    const databaseUrl = this.configService.getOrThrow("databaseUrl", {
      infer: true,
    });

    this.drizzle = drizzle(databaseUrl, { schema: { ...schema } });
  }
}
