import { verify } from "./token";

// بررسی می‌کند که درخواست یک توکن معتبر پنل مدیریت همراه دارد
export function requireAdmin(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return { ok: false };

  const result = verify(token);
  if (!result.ok || !result.payload.admin) return { ok: false };

  return { ok: true };
}
