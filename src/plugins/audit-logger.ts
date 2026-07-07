import { FastifyPluginAsync } from 'fastify';

interface AuditEvent {
  timestamp: string;
  event: string;
  userId?: string;
  ip: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

export const auditLoggerPlugin: FastifyPluginAsync = async (app) => {
  const auditLog: AuditEvent[] = [];

  // Expose audit log methods to the app
  app.decorate('auditLog', {
    log: (event: string, details?: Record<string, unknown>) => {
      const auditEvent: AuditEvent = {
        timestamp: new Date().toISOString(),
        event,
        ip: 'unknown',
        details,
      };
      auditLog.push(auditEvent);
      app.log.info({ audit: auditEvent }, `AUDIT: ${event}`);
    },
    getLogs: () => auditLog,
  });

  // Log authentication attempts
  app.addHook('onRequest', async (request) => {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      app.auditLog.log('AUTH_ATTEMPT', {
        hasToken: !!authHeader,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      });
    }
  });

  // Log authorization failures
  app.addHook('onError', async (request, reply, error) => {
    if (reply.statusCode === 401 || reply.statusCode === 403) {
      app.auditLog.log('AUTH_FAILURE', {
        statusCode: reply.statusCode,
        path: request.url,
        method: request.method,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      });
    }
  });

  // Log rate limit hits
  app.addHook('onResponse', async (request, reply) => {
    if (reply.statusCode === 429) {
      app.auditLog.log('RATE_LIMIT_EXCEEDED', {
        path: request.url,
        method: request.method,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      });
    }
  });
};

// Type augmentation for TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    auditLog: {
      log: (event: string, details?: Record<string, unknown>) => void;
      getLogs: () => AuditEvent[];
    };
  }
}
