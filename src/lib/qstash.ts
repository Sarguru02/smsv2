import { Client } from "@upstash/qstash"
import { Env } from "./EnvVars"
export const qstash = new Client({
  token: Env.qstashToken!
});
