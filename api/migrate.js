require('dotenv').config();

const {runner} = require('node-pg-migrate');
const {Pool} = require('pg');
const path = require('path');

async function run() {
  const dbPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'hr_system',
  });

  try {
    await dbPool.connect();
    console.log('Connected to database');
    
    await runner({
      dbClient: dbPool,
      direction: 'up',
      dir: path.join(__dirname, 'migrations'),
      migrationsTable: 'pgmigrations',
      count: Infinity,
      createMigrationsSchema: true,
    });
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await dbPool.end();
  }
}

run().catch(error => {
  console.error('Unhandled error during migration:', error);
  process.exit(1);
});