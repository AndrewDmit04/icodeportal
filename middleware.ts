import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Log the request URL
  console.log('Request URL:', request.url);

  // Example: Add a custom header to the response
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'Hello from middleware');
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/punch', request.url));
  }

  return response;
}

export const config = {
  matcher: '/:path*', // Apply middleware to all routes
};