import { FastifyPluginAsync } from 'fastify';

// Sensitive fields that should not be logged
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'authorization',
  'creditCard',
  'ssn',
  'socialSecurityNumber',
  'POSTGRES_PASSWORD',
];

function sanitizeForLogging(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeForLogging);
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeForLogging(value);
      }
    }
    return sanitized;
  }

  return obj;
}

export const secureLoggerPlugin: FastifyPluginAsync = async (app) => {
  // Log requests without sensitive data
  app.addHook('onRequest', async (request) => {
    app.log.info({
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });
  });

  // Log responses without sensitive data
  app.addHook('onResponse', async (request, reply) => {
    app.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
    });
  });
};
