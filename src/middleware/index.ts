// src/middleware/index.js
function nextFactory(context: any, middleware: any, index: any) {
    const nextMiddleware = middleware[index]
  
    if (!nextMiddleware) return context.next
  
    return () => {
      const next = nextFactory(context, middleware, index + 1)
  
      nextMiddleware({ ...context, next })
    }
  }
  
  export function applyMiddleware(to: any, from: any, next: any) {
    if (!to.meta.middleware) return next()
  
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]
  
    const context = { from, next, router: to.router, to }
  
    const nextMiddleware = nextFactory(context, middleware, 0)
  
    nextMiddleware()
  }
  