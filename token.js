import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-only-secret-change-me";

// چون این پروژه دیتابیس ندارد، سفارش (لیست کتاب‌ها + مبلغ) به‌جای ذخیره در دیتابیس
// در یک توکن امضاشده نگه داشته می‌شود. کسی نمی‌تواند مبلغ یا لیست را دستکاری کند
// چون امضا با JWT_SECRET بررسی می‌شود.

export function sign(payload, ttl) {
  return jwt.sign(payload, SECRET, { expiresIn: ttl });
}

export function verify(token) {
  try {
    return { ok: true, payload: jwt.verify(token, SECRET) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
