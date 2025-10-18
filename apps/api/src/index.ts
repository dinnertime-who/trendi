import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

console.log("allowedOrigins", allowedOrigins);

app.use(
	"/*",
	cors({
		origin: allowedOrigins,
		allowHeaders: ["Authorization", "Content-Type"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	}),
);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

serve(
	{
		fetch: app.fetch,
		port: parseInt(process.env.PORT || "8000", 10),
	},
	(info) => {
		console.log(`Server is running on http://${info.address}:${info.port}`);
	},
);
