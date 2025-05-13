import type { User } from "@supabase/supabase-js";
import { createContext } from "react";

export interface AuthContextType {
  user: User | null;
  signInWithGitHub: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
