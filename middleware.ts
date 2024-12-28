import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Log the request URL
  console.log('Request URL:', request.url);

  // Example: Add a custom header to the response
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'Hello from middleware');

  return response;
}

export const config = {
  matcher: '/:path*', // Apply middleware to all routes
};