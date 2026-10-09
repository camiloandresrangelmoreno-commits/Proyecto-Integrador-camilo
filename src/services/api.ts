// Cliente de servicios API REST para SIGPA - UDI

export interface DbStatusResponse {
  status: string;
  timestamp: string;
  postgres: {
    ok: boolean;
    message: string;
    details?: {
      serverTime: string;
      database: string;
      version: string;
    };
  };
}

export const apiService = {
  // 1. Chequeo de conexión con la base de datos PostgreSQL
  async checkHealth(): Promise<DbStatusResponse | null> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // 2. Inicializar tablas en PostgreSQL en la nube
  async setupDatabase(): Promise<{ ok: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/setup-database', { method: 'POST' });
      return await res.json();
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  },

  // 3. Crear institución en el backend
  async createInstitution(data: any): Promise<boolean> {
    try {
      const res = await fetch('/api/instituciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 4. Crear docente asesor en el backend
  async createAdvisor(data: any): Promise<boolean> {
    try {
      const res = await fetch('/api/docentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 5. Registrar bitácora en el backend
  async createActivityLog(data: any): Promise<boolean> {
    try {
      const res = await fetch('/api/bitacoras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 6. Validar horas en el backend
  async validateLog(logId: string, validatedBy: string, observations?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/bitacoras/${logId}/validar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validatedBy, observations })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
