import { createContext, Dispatch } from "react";
import { User } from "../types/api";

const UserContext = createContext<{
  user: User | null;
  setUser: Dispatch<any>;
}>({
  user: null,
  setUser: null
});

export default UserContext;
