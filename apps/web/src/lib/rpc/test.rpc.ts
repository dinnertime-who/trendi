import type { TestRouteType } from "@api/routes/test.route";
import { hc } from "hono/client";
import { publicEnv } from "../env";

export const testRpc = hc<TestRouteType>(
  `${publicEnv.NEXT_PUBLIC_API_URL}/test`,
  {
    init: {
      credentials: "include",
    },
  },
);
