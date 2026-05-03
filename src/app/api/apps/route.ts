import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import App from '@/models/App';

export async function GET() {
  try {
    await connectDB();
    const apps = await App.find({}).populate('tenantId', 'name');
    return NextResponse.json(apps);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const app = new App(body);
    await app.save();
    const populated = await App.findById(app._id).populate('tenantId', 'name');
    return NextResponse.json(populated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

