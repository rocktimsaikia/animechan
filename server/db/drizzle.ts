import 'dotenv/config';

import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import * as schema from '~/db/schema';

const DATABASE_URL =
	process.env.NODE_ENV !== 'production'
		? process.env.DEV_DATABASE_URL
		: process.env.PROD_DATABASE_URL;

const connection = connect({
	url: DATABASE_URL
});

export const db = drizzle(connection, { schema, logger: true });
