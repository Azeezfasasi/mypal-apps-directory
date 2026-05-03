import 'dotenv/config.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import connectDB from '../src/lib/mongoose.js';

async function createAdmin() {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node createAdmin.js <name> <email> <password>');
    console.error('Example: node createAdmin.js "Admin User" admin@example.com password123');
    process.exit(1);
  }

  const [name, email, password] = args;

  try {
    // Connect to database
    console.log('Connecting to MongoDB...');
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`Error: User with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      disabled: false,
    });

    await adminUser.save();

    console.log('✓ Admin user created successfully!');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: admin`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
