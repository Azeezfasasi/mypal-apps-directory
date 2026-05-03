import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export async function createJWT(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyJWT(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getUserByEmail(email) {
  return User.findOne({ email });
}

export async function getAuthUser(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = verifyJWT(token);
    const user = await User.findById(decoded.userId).select('-password');
    return user;
  } catch {
    return null;
  }
}


