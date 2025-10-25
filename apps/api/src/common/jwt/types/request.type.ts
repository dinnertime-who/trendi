import type { Request } from "express";
import type { JwtPayload } from "./payload.type";

export type RequestWithUser = Omit<Request, "user"> & {
  user: {
    data: JwtPayload | null;
    isValid: boolean;
  };
};

export type RequestUser = RequestWithUser["user"];
