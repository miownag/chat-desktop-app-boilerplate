import { createMiddleware } from 'hono/factory';
import type { AppContext } from '../types/context';

export const requestLogger = createMiddleware<AppContext>(async (c, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  c.set('requestId', requestId);
  c.set('timestamp', start);

  console.log(`[${requestId}] ${c.req.method} ${c.req.url}`);

  await next();

  const end = Date.now();
  const duration = end - start;
  console.log(`[${requestId}] ${c.res.status} - ${duration}ms`);
});

export const errorHandler = createMiddleware<AppContext>(async (c, next) => {
  try {
    await next();
  } catch (err) {
    const requestId = c.get('requestId');
    console.error(`[${requestId}] Error:`, err);

    return c.json(
      {
        error: 'Internal Server Error',
        message: err instanceof Error ? err.message : 'Unknown error',
        requestId,
      },
      500,
    );
  }
});

// 响应包装中间件
export const responseWrapper = createMiddleware<AppContext>(async (c, next) => {
  await next();

  // 检查是否是 JSON 响应
  const contentType = c.res.headers.get('Content-Type');
  if (contentType?.includes('application/json')) {
    // 获取原始 JSON 数据
    const originalData = await c.res.json();

    // 包装数据
    const wrappedData = {
      code: 0,
      message: 'success',
      data: originalData,
    };

    // 创建新的响应
    c.res = new Response(JSON.stringify(wrappedData), {
      status: c.res.status,
      headers: c.res.headers,
    });
  }
});
