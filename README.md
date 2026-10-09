# SIGPA - Sistema Integral de Gestión de Prácticas Académicas (UDI)
**Proyecto Integrador - V Semestre de Ingeniería de Sistemas**
*Asignaturas vinculadas: Ingeniería del Software II | Programación III | Teoría General de Sistemas*
*Universidad de Investigación y Desarrollo - Bucaramanga, Colombia*

---

## 💻 1. ¿Cómo ejecutar este proyecto en Visual Studio Code?

Si descargas esta carpeta y la abres en tu computador con Visual Studio Code, **te va a funcionar exactamente igual a lo que estás viendo aquí**. Sigue estos sencillos pasos:

### Paso 1: Requisitos previos en tu computador
1. Asegúrate de tener instalado **Node.js** (versión 18 o superior). Puedes descargarlo gratis desde [nodejs.org](https://nodejs.org/).
2. Tener instalado **Visual Studio Code**.

### Paso 2: Abrir el proyecto en VS Code
1. Abre Visual Studio Code.
2. Ve a `File` -> `Open Folder...` (o `Archivo` -> `Abrir carpeta...`) y selecciona la carpeta del proyecto.

### Paso 3: Instalar dependencias
1. Abre la terminal integrada de VS Code presionando `Ctrl + ~` (o ve al menú superior `Terminal` -> `New Terminal`).
2. Escribe el siguiente comando y presiona Enter:
   ```bash
   npm install
   ```
   *(Esto descargará automáticamente todas las librerías necesarias: React, Tailwind CSS, Lucide Icons, Vite, etc.)*

### Paso 4: Iniciar el servidor local
1. En la misma terminal, ejecuta:
   ```bash
   npm run dev
   ```
2. La terminal te mostrará un enlace local, por ejemplo:
   ```text
   VITE v8.x ready in 250 ms
   ➜  Local:   http://localhost:3000/
   ```
3. Haz clic en el enlace o abre tu navegador web (Chrome, Edge, Firefox) y entra a `http://localhost:3000`.
4. **¡Listo! Verás exactamente la misma plataforma:**
   - La pantalla de inicio de sesión con los 5 roles separados (Estudiante, Docente Asesor, Director, Coordinador, Colegio).
   - El módulo del Coordinador con registro de Docentes Asesores e Instituciones.
   - La bitácora del estudiante con cálculo de horas reglamentarias del MEN.
   - Las rúbricas pedagógicas de evaluación.
   - El informe consolidado de acreditación para imprimir o exportar.

---

## 🐘 2. ¿Cómo conectar este proyecto a PostgreSQL en la Nube?

### ⚠️ Principio de Ingeniería de Software (Por qué se hace así):
En el desarrollo de software profesional, una aplicación de **React (Frontend)** corre dentro del navegador del usuario. Por seguridad, **un navegador web NUNCA debe conectarse directamente a PostgreSQL**, porque si pusieras la contraseña de tu base de datos en React, cualquier persona podría darle clic derecho -> "Inspeccionar" y robarse tu base de datos.

La arquitectura correcta que te evaluarán en **Ingeniería de Software II y Programación III** es la siguiente:

```text
[ React Frontend (Tu Web) ]
           │  (Peticiones HTTP / JSON)
           ▼
[ Backend API (Node.js / Express o Supabase / Serverless) ]
           │  (Conexión segura con clave protegida)
           ▼
[ Base de Datos PostgreSQL en la Nube ] (Neon / Supabase / Render)
```

---

### Opción A: PostgreSQL Gratis en la Nube con Neon.tech o Supabase (Recomendado en 3 minutos)

#### Paso 1: Crear tu base de datos en la nube (Gratis)
1. Entra a **[neon.tech](https://neon.tech/)** o **[supabase.com](https://supabase.com/)** y crea una cuenta gratuita con tu cuenta de Google o GitHub.
2. Dale clic a **"Create Project"** o **"New Project"**.
3. asígnale el nombre `sigpa_udi` y selecciona la región más cercana (ej. `us-east-1` o `us-east-2`).
4. Te entregará una cadena de conexión (`DATABASE_URL`) que luce así:
   ```text
   postgresql://usuario:contraseña@ep-xyz.us-east-2.aws.neon.tech/sigpa_udi?sslmode=require
   ```

#### Paso 2: Crear las tablas en tu base de datos
1. En el panel de Neon o Supabase, ve a la pestaña **"SQL Editor"**.
2. Abre el archivo `database.sql` que te dejamos en este proyecto.
3. Copia todo su contenido y pégalo en el editor SQL de la nube.
4. Presiona el botón **"Run"** (Ejecutar).
5. **¡Automáticamente se crearán las 9 tablas del sistema!**:
   - `rol`
   - `usuario`
   - `institucion_receptora`
   - `asignacion_practica`
   - `bitacora_actividad`
   - `plan_clase`
   - `visita_supervision`
   - `evaluacion_rubrica`
   - `detalle_criterio_rubrica`

---

### Opción B: Conectar tu Frontend con el Backend en Node.js

Para que tu proyecto guarde y lea datos de PostgreSQL:

1. Instala el conector oficial de PostgreSQL en tu proyecto:
   ```bash
   npm install pg dotenv
   npm install -D @types/pg
   ```
2. Crea un archivo `.env` en la raíz de tu proyecto y pega tu URL de la nube:
   ```env
   DATABASE_URL=postgresql://usuario:contraseña@ep-xyz.us-east-2.aws.neon.tech/sigpa_udi?sslmode=require
   PORT=3000
   ```
3. En tu backend (servidor Node.js), creas la conexión con un pool:
   ```typescript
   import { Pool } from 'pg';
   import dotenv from 'dotenv';
   dotenv.config();

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });

   // Ejemplo de ruta para consultar practicantes
   app.get('/api/estudiantes', async (req, res) => {
     try {
       const result = await pool.query('SELECT * FROM asignacion_practica');
       res.json(result.rows);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });
   ```

*(Nota: Mientras configuras tu base de datos en la nube, el proyecto actual cuenta con persistencia inteligente en `localStorage`, lo que significa que puedes agregar bitácoras, registrar colegios, calificar con rúbricas y los datos se conservan aunque cierres o recargues la página).*

---

## 👥 Credenciales Demo para Probar los Roles:
* **Estudiante Practicante:** Código `2022104509` | Clave: `estudiante2026`
* **Docente Asesor:** Correo `mrueda@udi.edu.co` | Clave: `docente2026`
* **Director de Programa:** Correo `egomez@udi.edu.co` | Clave: `director2026`
* **Coordinador de Prácticas:** Correo `cbenitez@udi.edu.co` | Clave: `coordinador2026`
* **Institución Receptora:** NIT `890.201.442-1` | Clave: `colegio2026`
