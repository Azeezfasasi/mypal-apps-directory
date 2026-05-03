import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { hashPassword, verifyJWT } from '@/lib/auth';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ message: 'No token' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    const admin = await User.findById(decoded.userId).select('role');
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ message: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });
    const { password: _, ...userResponse } = user.toObject();

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

