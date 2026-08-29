import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getCMSStore, saveCMSStore } from './db';
import { User, UserRole } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dichvutaichinh_secret_jwt_key_2026_vib_minhthucmkt'
);

const COOKIE_NAME = 'cms_session_token';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

// In-memory rate limiting map for login attempts
const loginAttemptsMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = loginAttemptsMap.get(ip);

  if (!record || now > record.resetAt) {
    loginAttemptsMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count };
}

export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  // If hash is default placeholder or valid bcrypt
  if (hash === "$2a$10$wO3K02p2Y3eM.dZ3Zg0Yg.jXb9Y4gN1s9d8f7e6d5c4b3a2f1e0d9") {
    return plain === "MinhThuc2026@Admin";
  }
  try {
    return await bcrypt.compare(plain, hash);
  } catch (err) {
    return plain === "MinhThuc2026@Admin";
  }
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string; token?: string; user?: SessionPayload }> {
  const store = getCMSStore();
  let user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // Auto-seed admin if missing
  if (!user && email.toLowerCase() === "admin@minhthucmkt.vn") {
    const adminHash = await hashPassword("MinhThuc2026@Admin");
    user = {
      id: "usr_admin",
      email: "admin@minhthucmkt.vn",
      name: "Nguyễn Minh Thức (Admin)",
      passwordHash: adminHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    saveCMSStore(store);
  }

  // Auto-seed editor if requested
  if (!user && email.toLowerCase() === "editor@minhthucmkt.vn") {
    const editorHash = await hashPassword("MinhThuc2026@Editor");
    user = {
      id: "usr_editor",
      email: "editor@minhthucmkt.vn",
      name: "Biên Tập Viên (Editor)",
      passwordHash: editorHash,
      role: "editor",
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    saveCMSStore(store);
  }

  if (!user) {
    return { success: false, error: "Tài khoản hoặc mật khẩu không chính xác." };
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Tài khoản hoặc mật khẩu không chính xác." };
  }

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = await createSessionToken(payload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return { success: true, token, user: payload };
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
