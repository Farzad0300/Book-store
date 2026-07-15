import { getAllBooks } from "../../lib/store";
import { sign } from "../../lib/token";
import { requestPayment } from "../../lib/zarinpal";
import { PAYMENTS_ENABLED } from "../../lib/config";

const SITE_URL = process.env.SITE_URL || process.env.URL || "http://localhost:3000";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!PAYMENTS_ENABLED) {
    return res.status(400).json({ error: "درگاه پرداخت هنوز فعال نشده است." });
  }

  const { bookIds, email } = req.body || {};

  if (!Array.isArray(bookIds) || bookIds.length === 0 || !email) {
    return res.status(400).json({ error: "کتاب و ایمیل الزامی است" });
  }

  const books = await getAllBooks();
  const selected = books.filter((b) => bookIds.includes(b.id));

  if (selected.length !== bookIds.length) {
    return res.status(404).json({ error: "یک یا چند کتاب پیدا نشد" });
  }

  const notPublished = selected.find((b) => !b.published);
  if (notPublished) {
    return res.status(400).json({ error: `«${notPublished.title}» هنوز منتشر نشده است` });
  }

  const amount = selected.reduce((sum, b) => sum + b.price, 0);

  // اطلاعات سفارش را در یک توکن امضاشده نگه می‌داریم، نه در دیتابیس
  const orderToken = sign({ bookIds: selected.map((b) => b.id), amount, email }, "30m");

  const callbackUrl = `${SITE_URL}/api/payment-callback?data=${encodeURIComponent(orderToken)}`;

  const description =
    selected.length === 1 ? `خرید کتاب: ${selected[0].title}` : `خرید ${selected.length} کتاب`;

  const payment = await requestPayment({ amount, description, callbackUrl, email });

  if (!payment.ok) {
    return res.status(502).json({ error: "اتصال به درگاه پرداخت ناموفق بود" });
  }

  return res.status(200).json({ payUrl: payment.payUrl });
}
