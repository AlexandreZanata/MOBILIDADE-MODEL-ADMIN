const API_BASE_URL = 'http://172.19.2.123:8000/api';

export default async function handler(req: any, res: any) {
  console.log('[Proxy] Handler called', req.method, req.url);
  console.log('[Proxy] Query:', req.query);
  
  // Tratar CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Extrair o path dos query params
  const pathArray = req.query.path as string[] | string | undefined;
  const pathString = Array.isArray(pathArray) 
    ? pathArray.join('/') 
    : pathArray || '';
  
  console.log('[Proxy] Path string:', pathString);
  
  // Extrair outros query params (não o path)
  const { path: _, ...otherParams } = req.query;
  const queryParams = otherParams as Record<string, string | string[]>;
  
  // Construir query string
  const queryEntries: string[] = [];
  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => queryEntries.push(`${key}=${encodeURIComponent(v)}`));
    } else if (value) {
      queryEntries.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  const queryString = queryEntries.length > 0 ? '?' + queryEntries.join('&') : '';
  
  // Construir a URL completa do backend
  // O pathString já contém o caminho completo (ex: "auth/login")
  // e o API_BASE_URL já tem /api, então não precisa adicionar / novamente
  const targetUrl = pathString 
    ? `${API_BASE_URL}/${pathString}${queryString}`
    : `${API_BASE_URL}${queryString}`;
  
  console.log(`[Proxy] ${req.method} ${req.url} -> ${targetUrl}`);
  console.log(`[Proxy] Path:`, pathString);
  console.log(`[Proxy] Query:`, queryParams);
  
  // Copiar headers importantes
  const headers: Record<string, string> = {};
  
  // Content-Type
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'] as string;
  }
  
  // Authorization
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }
  
  try {
    const body = req.method !== 'GET' && req.method !== 'HEAD' && req.body
      ? JSON.stringify(req.body)
      : undefined;
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });
    
    const data = await response.text();
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Content-Type da resposta
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Status code
    res.status(response.status);
    
    // Enviar resposta
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch {
      res.send(data);
    }
  } catch (error: any) {
    console.error('[Proxy Error]', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      targetUrl 
    });
  }
}

