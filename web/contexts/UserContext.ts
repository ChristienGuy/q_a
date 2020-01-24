import { createContext } from "react";
import { User } from "../types/api";

const UserContext = createContext<{
  user: User | null;
  login?: (
    email: string,
    password: string
  ) => Promise<{ status: number; statusText: string }>;
  logout?: () => void;
}>({
  user: null,
  login: null,
  logout: null
});

export default UserContext;
