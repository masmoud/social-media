import { createClient } from "@supabase/supabase-js";
import { envConfig } from "./config/env";

export const supabase = createClient(envConfig.supabaseurl, envConfig.supabasekey);
