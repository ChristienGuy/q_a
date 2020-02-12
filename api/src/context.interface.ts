import { Request as ExpressRequest, Response } from "express";
import { User as QaUser } from "./entity/User";

interface Request extends ExpressRequest {
  user?: QaUser | { role?: string };
}

export interface Context {
  req: Request;
  res: Response;
}
