import { Client } from "@upstash/qstash"
import { Env } from "./EnvVars"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest } from "next/server";
export const qstash = new Client({
  token: Env.qstashToken!
});

type AppRouteHandler = (
  req: NextRequest
) => Promise<Response>;

export const qstashWrapper = (
  handler: AppRouteHandler
): AppRouteHandler => {
  return Env.qstashCurrentSigningKey ?
  verifySignatureAppRouter(handler) : handler;
};

