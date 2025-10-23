import { BcryptHashed, BcryptHashedSchema } from "@internal/schemas";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;

  async hash(
    plainText: string, //
  ) {
    const hashed = await bcrypt.hash(plainText, this.saltRounds);
    return BcryptHashedSchema.parse(hashed);
  }

  async compare(
    plainText: string, //
    hashed: BcryptHashed,
  ) {
    return await bcrypt.compare(plainText, hashed);
  }
}
