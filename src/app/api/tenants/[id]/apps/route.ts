import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import App from '@/models/App';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const apps = await App.find({ tenantId: id });
    return NextResponse.json(apps);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

