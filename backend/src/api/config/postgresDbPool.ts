import {Pool, PoolConfig} from 'pg';

export const defaultPostgresDbSchemeName = process.env.DATABASE_SCHEMA ?? 'capital_delivery';
let pool: Pool | undefined;

const parseIntEnv = (value: string | undefined, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const dbConfig: PoolConfig = {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {rejectUnauthorized: false},
    max: parseIntEnv(process.env.DATABASE_POOL_MAX, 10),
    min: parseIntEnv(process.env.DATABASE_POOL_MIN, 0),
    idleTimeoutMillis: parseIntEnv(process.env.DATABASE_POOL_IDLE_MS, 30000),
    connectionTimeoutMillis: parseIntEnv(process.env.DATABASE_POOL_CONN_TIMEOUT_MS, 5000),
    keepAlive: true,
    allowExitOnIdle: true
};

export const getPostgresDbPool = () => {
    if (pool) return pool;
    pool = new Pool(dbConfig);
    pool.on('error', (error) => {
        console.error('Unexpected idle client error in Postgres pool.', error);
    });

    pool.connect()
        .then((client) => {
            client.release();
            console.log('Connected to the Postgres database.');
        })
        .catch((error) => {
            console.error('Error connecting to the Postgres database.', error);
        });
    return pool;
};
