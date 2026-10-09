import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/routes.js';
import { checkDbConnection } from './src/server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middlewares estándar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API REST del Sistema SIGPA
app.use('/api', apiRouter);

// Integración Full-Stack con Vite
async function startServer() {
  if (!isProduction) {
    // Modo Desarrollo: Integrar Vite como middleware de Express
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite middlewares montados en Express para modo desarrollo');
  } else {
    // Modo Producción: Servir estáticos pre-compilados en dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', async () => {
    console.log(`====================================================`);
    console.log(`🚀 Servidor SIGPA - UDI ejecutándose en puerto ${PORT}`);
    console.log(`📍 URL Local: http://localhost:${PORT}`);
    console.log(`📡 API Endpoints listos en: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);

    // Probar conexión a PostgreSQL
    const dbStatus = await checkDbConnection();
    if (dbStatus.ok) {
      console.log(`🟢 PostgreSQL: Conectado exitosamente.`);
    } else {
      console.log(`🟡 PostgreSQL: Modo local activo (${dbStatus.message}).`);
      console.log(`💡 Para conectar a la nube, coloca tu DATABASE_URL en el archivo .env`);
    }
  });
}

startServer().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
