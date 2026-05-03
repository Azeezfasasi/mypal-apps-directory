import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Tenant from '@/models/Tenant.js';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    let query = {};
    if (categoryId) {
      query.tenantCategoryId = categoryId;
    }
    
    const tenants = await Tenant.find(query).populate('tenantCategoryId', 'name').sort({ name: 1 });
    return NextResponse.json(tenants);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const tenant = new Tenant(body);
    await tenant.save();
    const populated = await Tenant.findById(tenant._id).populate('tenantCategoryId', 'name');
    return NextResponse.json(populated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

