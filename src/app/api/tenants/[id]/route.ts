import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Tenant from '@/models/Tenant';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const tenant = await Tenant.findById(id).populate('tenantCategoryId', 'name');
    if (!tenant) {
      return NextResponse.json({ message: 'Tenant not found' }, { status: 404 });
    }
    return NextResponse.json(tenant);
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
    const tenant = await Tenant.findByIdAndUpdate(id, body, { new: true }).populate('tenantCategoryId', 'name');
    if (!tenant) {
      return NextResponse.json({ message: 'Tenant not found' }, { status: 404 });
    }
    return NextResponse.json(tenant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Tenant.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Tenant deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

