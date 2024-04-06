import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().basePath("v1");

const User = z.object({
	first_name: z.string().optional(),
	last_name: z.string().min(1, "At least 1 char").max(50),
	gender: z.enum(["MALE", "FEMALE"]),
});

type User = z.infer<typeof User>;

const users = new Set<User>();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/users", (c) => {
	return c.json(Array.from(users));
});

app.post("/users", zValidator("json", User), async (c) => {
	const input = await c.req.json();

	// const validateResult = await User.safeParseAsync(input)

	// if(!validateResult.success) {
	//   return c.json({
	//     message: `${validateResult.error.errors[0].path} ==> ${validateResult.error.errors[0].message}`
	//   }, 400)
	// }

	// const user = validateResult.data

	const user: User = input;

	users.add(user);
  
	return c.json(null);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
