import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import TenantCategory from '@/models/TenantCategory';

export async function GET() {
  try {
    await connectDB();
    const categories = await TenantCategory.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const category = new TenantCategory(body);
    await category.save();
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

