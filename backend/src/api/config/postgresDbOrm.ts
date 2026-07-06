import { DataSource } from 'typeorm';
import { defaultPostgresDbSchemeName } from '@config/postgresDbPool';

let dataSource: DataSource;

export default async function initialisePostgresDataSource() {
  dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    schema: defaultPostgresDbSchemeName,
    logging: ['error', 'warn'],
    entities: [
      'dist/skewb-capital-delivery-server/src/api/**/*Entity.{ts,js}',
      'dist/skewb-capital-delivery-server/src/models/*Entity.{ts,js}'
    ],
    extra: {
      options: '-c timezone=UTC',
      ssl: {
        rejectUnauthorized: false // Disable strict verification (not recommended)
        // OR
        // ca: '/path/to/server-ca.crt', // Path to server certificate authority certificate
        // cert: '/path/to/client-cert.pem', // Path to client certificate
        // key: '/path/to/client-key.pem', // Path to client key
      }
    }
  });

  try {
    return await dataSource.initialize();
  } catch (error) {
    if (error) console.error('Error initializing TypeORM for Postgres:', error);
    throw error;
  }
}
