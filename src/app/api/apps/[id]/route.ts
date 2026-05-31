import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import App from '@/models/App';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const app = await App.findById(id).populate('tenantId', 'name');
    if (!app) {
      return NextResponse.json({ message: 'App not found' }, { status: 404 });
    }
    return NextResponse.json(app);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const app = await App.findByIdAndUpdate(id, body, { new: true }).populate('tenantId', 'name');
    if (!app) {
      return NextResponse.json({ message: 'App not found' }, { status: 404 });
    }
    return NextResponse.json(app);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await App.findByIdAndDelete(id);
    return NextResponse.json({ message: 'App deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const app = await App.findByIdAndUpdate(id, body, { new: true }).populate('tenantId', 'name');
    if (!app) {
      return NextResponse.json({ message: 'App not found' }, { status: 404 });
    }
    return NextResponse.json(app);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
