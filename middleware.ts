import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token by calling /api/profiles/me (adjust endpoint)
  try {
    // Note: Full verification would fetch from backend; here mock role check for now
    // Real: fetch(`${process.env.API_URL}/profiles/me`, { headers: { Authorization: `Bearer ${token}` } })
    // const user = await response.json();
    // if (!user || !['Admin', 'Viewer'].includes(user.role)) throw new Error();
    const validRoles = ['Admin', 'Viewer'];
    // Simulate - replace with real fetch
    if (!validRoles.some(role => token.includes(role))) { // Dummy check
      throw new Error('Invalid role');
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/app/:path*',
};
