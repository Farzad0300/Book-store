import { sign } from "../../../lib/token";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body || {};

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "رمز عبور اشتباه است" });
  }

  const token = sign({ admin: true }, "12h");
  return res.status(200).json({ token });
}
