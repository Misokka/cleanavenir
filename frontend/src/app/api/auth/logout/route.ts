import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' });
  // Clear auth cookies
  res.cookies.set('accessToken', '', { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0 });
  res.cookies.set('refreshToken', '', { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0 });
  return res;
}
