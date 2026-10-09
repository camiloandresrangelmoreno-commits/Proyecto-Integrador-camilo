import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexiones a PostgreSQL
let pool: Pool | null = null;
let isConnected = false;
let connectionError: string | null = null;

export const getDbPool = (): Pool | null => {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    connectionError = 'Variable DATABASE_URL no configurada en el archivo .env';
    return null;
  }

  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 10
    });

    pool.on('error', (err) => {
      console.error('Error imprevisto en el cliente de PostgreSQL:', err);
      isConnected = false;
    });

    return pool;
  } catch (err: any) {
    connectionError = err.message || 'Error al inicializar pool de PostgreSQL';
    return null;
  }
};

export const checkDbConnection = async (): Promise<{ ok: boolean; message: string; details?: any }> => {
  const currentPool = getDbPool();
  if (!currentPool) {
    return {
      ok: false,
      message: connectionError || 'No se ha configurado la cadena de conexión DATABASE_URL'
    };
  }

  try {
    const res = await currentPool.query('SELECT NOW() AS server_time, current_database() AS db_name, version() AS version;');
    isConnected = true;
    connectionError = null;
    return {
      ok: true,
      message: 'Conexión exitosa a la base de datos PostgreSQL en la nube',
      details: {
        serverTime: res.rows[0].server_time,
        database: res.rows[0].db_name,
        version: res.rows[0].version
      }
    };
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message;
    return {
      ok: false,
      message: `Error al conectar a PostgreSQL: ${err.message}`
    };
  }
};

export const queryDb = async (text: string, params?: any[]) => {
  const currentPool = getDbPool();
  if (!currentPool) {
    throw new Error('Base de datos no conectada. Configure DATABASE_URL en el archivo .env');
  }
  return await currentPool.query(text, params);
};
