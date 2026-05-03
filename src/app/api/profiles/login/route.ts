import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { verifyPassword, createJWT } from '@/lib/auth';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user || !await verifyPassword(password, user.password)) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.disabled) {
      return NextResponse.json({ message: 'Account disabled' }, { status: 403 });
    }

    const token = await createJWT(user);
    const { password: _, ...userResponse } = user.toObject();

    return NextResponse.json({ user: userResponse, token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

