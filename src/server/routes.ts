import { Router, Request, Response } from 'express';
import { checkDbConnection, queryDb, getDbPool } from './db.js';
import fs from 'fs';
import path from 'path';

export const apiRouter = Router();

// 1. Chequeo de Salud y Estado de Conexión a la Base de Datos
apiRouter.get('/health', async (_req: Request, res: Response) => {
  const dbStatus = await checkDbConnection();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    postgres: dbStatus
  });
});

// 2. Ejecutar Inicialización y Migración Automática de Tablas en PostgreSQL
apiRouter.post('/setup-database', async (_req: Request, res: Response) => {
  const pool = getDbPool();
  if (!pool) {
    return res.status(400).json({
      ok: false,
      error: 'No se puede inicializar la base de datos. Por favor define DATABASE_URL en tu archivo .env'
    });
  }

  try {
    // Leer el script database.sql
    const sqlPath = path.resolve(process.cwd(), 'database.sql');
    if (!fs.existsSync(sqlPath)) {
      return res.status(404).json({ ok: false, error: 'No se encontró el archivo database.sql en el servidor' });
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    await pool.query(sqlContent);

    res.json({
      ok: true,
      message: 'Base de datos PostgreSQL inicializada con éxito: Tablas y datos semilla creados'
    });
  } catch (err: any) {
    console.error('Error al ejecutar database.sql:', err);
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

// Helper para ejecutar consultas con tolerancia a esquemas gestion.* o public.*
async function safeQuery(pool: any, queries: string[], params: any[] = []) {
  for (const q of queries) {
    try {
      const res = await pool.query(q, params);
      return res;
    } catch {
      continue;
    }
  }
  throw new Error('No se pudo ejecutar la consulta en los esquemas disponibles');
}

// 3. Endpoint: Instituciones y Convenios
apiRouter.get('/instituciones', async (_req: Request, res: Response) => {
  try {
    const pool = getDbPool();
    if (pool) {
      const result = await safeQuery(pool, [
        'SELECT id_institucion, nombre, direccion, ciudad, telefono FROM gestion.institucion ORDER BY id_institucion ASC;',
        'SELECT * FROM institucion_receptora ORDER BY id_institucion ASC;'
      ]);
      return res.json({ ok: true, source: 'postgresql', data: result.rows });
    }
  } catch (err: any) {
    console.warn('Fallback local para instituciones:', err.message);
  }
  res.json({ ok: true, source: 'memory', message: 'Usando modo local' });
});

apiRouter.post('/instituciones', async (req: Request, res: Response) => {
  const { name, nit, rectorOrDirector, address, city, phone, email, agreementNumber, agreementValidUntil, availableSlots, sector, tutorName } = req.body;
  try {
    const pool = getDbPool();
    if (pool) {
      const query = `
        INSERT INTO institucion_receptora 
        (nombre, nit, rector_director, direccion, ciudad, telefono, email, numero_convenio, vigencia_convenio, cupos_totales, sector, tutor_institucional)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `;
      const values = [name, nit, rectorOrDirector, address, city || 'Bucaramanga', phone, email, agreementNumber, agreementValidUntil, availableSlots || 6, sector || 'Oficial', tutorName];
      const result = await pool.query(query, values);
      return res.status(201).json({ ok: true, source: 'postgresql', data: result.rows[0] });
    }
  } catch (err: any) {
    console.error('Error al insertar institucion:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
  res.json({ ok: true, source: 'memory', message: 'Registrado en memoria' });
});

// 4. Endpoint: Docentes Asesores UDI
apiRouter.get('/docentes', async (_req: Request, res: Response) => {
  try {
    const pool = getDbPool();
    if (pool) {
      const result = await pool.query(`
        SELECT u.*, r.nombre AS rol_nombre 
        FROM usuario u 
        JOIN rol r ON u.id_rol = r.id_rol 
        WHERE r.nombre = 'docente' 
        ORDER BY u.id_usuario ASC
      `);
      return res.json({ ok: true, source: 'postgresql', data: result.rows });
    }
  } catch (err: any) {
    console.warn('Fallback local para docentes:', err.message);
  }
  res.json({ ok: true, source: 'memory', message: 'Usando modo local' });
});

apiRouter.post('/docentes', async (req: Request, res: Response) => {
  const { name, email, documentNumber, phone, facultyOrSchool, password } = req.body;
  try {
    const pool = getDbPool();
    if (pool) {
      const query = `
        INSERT INTO usuario 
        (id_rol, nombre_completo, email, documento, telefono, programa_academico, clave)
        VALUES (3, $1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const values = [name, email, documentNumber, phone, facultyOrSchool || 'Dpto. de Práctica Pedagógica y Didáctica - UDI', password || 'docente2026'];
      const result = await pool.query(query, values);
      return res.status(201).json({ ok: true, source: 'postgresql', data: result.rows[0] });
    }
  } catch (err: any) {
    console.error('Error al insertar docente:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
  res.json({ ok: true, source: 'memory', message: 'Docente registrado en memoria' });
});

// 5. Endpoint: Asignaciones de Práctica
apiRouter.get('/asignaciones', async (_req: Request, res: Response) => {
  try {
    const pool = getDbPool();
    if (pool) {
      const query = `
        SELECT 
          a.id_asignacion,
          u.nombre_completo AS student_name,
          u.codigo_estudiantil AS student_code,
          u.programa_academico AS student_program,
          i.id_institucion,
          i.nombre AS institution_name,
          d.id_usuario AS advisor_id,
          d.nombre_completo AS advisor_name,
          a.periodo_academico,
          a.nivel_practica,
          a.horas_requeridas,
          a.horas_completadas,
          a.horas_validadas,
          a.fecha_inicio,
          a.fecha_fin,
          a.estado,
          a.nota_promedio
        FROM asignacion_practica a
        JOIN usuario u ON a.id_estudiante = u.id_usuario
        JOIN institucion_receptora i ON a.id_institucion = i.id_institucion
        JOIN usuario d ON a.id_docente_asesor = d.id_usuario
        ORDER BY a.id_asignacion ASC;
      `;
      const result = await pool.query(query);
      return res.json({ ok: true, source: 'postgresql', data: result.rows });
    }
  } catch (err: any) {
    console.warn('Fallback local para asignaciones:', err.message);
  }
  res.json({ ok: true, source: 'memory', message: 'Usando modo local' });
});

// 6. Endpoint: Bitácoras de Actividades
apiRouter.get('/bitacoras', async (req: Request, res: Response) => {
  const { asignacionId } = req.query;
  try {
    const pool = getDbPool();
    if (pool) {
      let query = 'SELECT * FROM bitacora_actividad';
      const params: any[] = [];
      if (asignacionId) {
        query += ' WHERE id_asignacion = $1';
        params.push(asignacionId);
      }
      query += ' ORDER BY fecha DESC, id_bitacora DESC';
      const result = await pool.query(query, params);
      return res.json({ ok: true, source: 'postgresql', data: result.rows });
    }
  } catch (err: any) {
    console.warn('Fallback local para bitacoras:', err.message);
  }
  res.json({ ok: true, source: 'memory', message: 'Usando modo local' });
});

apiRouter.post('/bitacoras', async (req: Request, res: Response) => {
  const { assignmentId, date, hours, activityType, title, description, evidenceLink } = req.body;
  try {
    const pool = getDbPool();
    if (pool) {
      const query = `
        INSERT INTO bitacora_actividad 
        (id_asignacion, fecha, horas, tipo_actividad, titulo, descripcion, evidencia_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [assignmentId || 1, date, hours, activityType, title, description, evidenceLink];
      const result = await pool.query(query, values);

      // Incrementar horas completadas en asignación
      await pool.query(
        'UPDATE asignacion_practica SET horas_completadas = horas_completadas + $1 WHERE id_asignacion = $2',
        [hours, assignmentId || 1]
      );

      return res.status(201).json({ ok: true, source: 'postgresql', data: result.rows[0] });
    }
  } catch (err: any) {
    console.error('Error al insertar bitacora:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
  res.json({ ok: true, source: 'memory', message: 'Sesión guardada en memoria' });
});

// 7. Endpoint: Validar Bitácora por Colegio Receptora
apiRouter.put('/bitacoras/:id/validar', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { validatedBy, observations } = req.body;
  try {
    const pool = getDbPool();
    if (pool) {
      const updateQuery = `
        UPDATE bitacora_actividad 
        SET validado_institucion = TRUE, 
            validado_por = $1, 
            fecha_validacion = CURRENT_DATE, 
            observaciones_colegio = $2
        WHERE id_bitacora = $3
        RETURNING *;
      `;
      const result = await pool.query(updateQuery, [validatedBy, observations, id]);
      if (result.rows.length > 0) {
        const log = result.rows[0];
        // Sumar horas validadas en asignación
        await pool.query(
          'UPDATE asignacion_practica SET horas_validadas = horas_validadas + $1 WHERE id_asignacion = $2',
          [log.horas, log.id_asignacion]
        );
        return res.json({ ok: true, source: 'postgresql', data: log });
      }
    }
  } catch (err: any) {
    console.error('Error al validar bitacora:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
  res.json({ ok: true, source: 'memory', message: 'Validado localmente' });
});

// 8. Endpoint: KPIs para el Director de Programa
apiRouter.get('/kpis', async (_req: Request, res: Response) => {
  try {
    const pool = getDbPool();
    if (pool) {
      const statsQuery = `
        SELECT 
          COUNT(*)::INT AS total_estudiantes,
          COUNT(CASE WHEN estado = 'activa' THEN 1 END)::INT AS practicas_activas,
          COUNT(CASE WHEN estado = 'en_riesgo' THEN 1 END)::INT AS practicas_en_riesgo,
          COUNT(CASE WHEN estado = 'completada' THEN 1 END)::INT AS practicas_completadas,
          COALESCE(SUM(horas_completadas), 0)::INT AS total_horas_reportadas,
          COALESCE(SUM(horas_validadas), 0)::INT AS total_horas_validadas,
          COALESCE(ROUND(AVG(nota_promedio), 2), 4.5) AS nota_promedio_general
        FROM asignacion_practica;
      `;
      const agreementsQuery = "SELECT COUNT(*)::INT AS convenios_vigentes FROM institucion_receptora WHERE estado_convenio = 'vigente';";
      
      const statsRes = await pool.query(statsQuery);
      const agreementsRes = await pool.query(agreementsQuery);

      return res.json({
        ok: true,
        source: 'postgresql',
        data: {
          ...statsRes.rows[0],
          convenios_vigentes: agreementsRes.rows[0].convenios_vigentes
        }
      });
    }
  } catch (err: any) {
    console.warn('Fallback local para KPIs:', err.message);
  }
  res.json({ ok: true, source: 'memory', message: 'Calculado en memoria' });
});
