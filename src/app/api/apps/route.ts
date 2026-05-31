import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import App from '@/models/App';

export async function GET(request) {
  try {
    await connectDB();
    let filter = {};
    if (request && request.url) {
      const { searchParams } = new URL(request.url);
      if (searchParams.has('disabled')) {
        const disabled = searchParams.get('disabled');
        if (disabled === 'true') filter = { disabled: true };
        else if (disabled === 'false') filter = { disabled: false };
      }
    }
    if (Object.keys(filter).length === 0) filter = { disabled: false };
    const apps = await App.find(filter).populate('tenantId', 'name');
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

