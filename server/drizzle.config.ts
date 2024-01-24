import type { Config } from 'drizzle-kit';

const DATABASE_URL =
	process.env.NODE_ENV !== 'production'
		? process.env.DEV_DATABASE_URL
		: process.env.PROD_DATABASE_URL;

export default {
	driver: 'mysql2',
	schema: './db/schema.ts',
	out: './migrations',
	dbCredentials: {
		uri: DATABASE_URL,
	},
	strict: true,
} satisfies Config;
