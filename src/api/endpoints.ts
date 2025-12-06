export const API_ENDPOINTS = {
  PROFILE: {
    GET: '/information',
    UPDATE: (id: string) => `/information/${id}`,
  },
  EMPLOYEES: {
    GET: '/product',
    CREATE: '/product',
    UPDATE: (id: string) => `/product/${id}`,
    DELETE: (id: string) => `/product/${id}`,
  },
} as const;

