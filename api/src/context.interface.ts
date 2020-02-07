import { Request as ExpressRequest, Response } from "express";
import { User as QaUser } from "./entity/User";

interface Request extends ExpressRequest {
  user?: QaUser;
}

export interface Context {
  req: Request;
  res: Response;
}
