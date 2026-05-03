import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { verifyJWT } from '@/lib/auth';
import User from '@/models/User.js';

export async function GET(request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ message: 'No token' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

