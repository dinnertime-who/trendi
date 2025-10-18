import { validateEnv } from "./lib/env";

export async function register() {
  console.log("register instrumentation");
  validateEnv();
}
