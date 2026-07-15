import { verify, sign } from "../../lib/token";
import { verifyPayment } from "../../lib/zarinpal";

export default async function handler(req, res) {
  const { Authority, Status, data } = req.query;

  const orderCheck = verify(data);
  if (!orderCheck.ok) {
    return res.redirect(302, "/checkout-result?status=error");
  }

  const { bookIds, amount } = orderCheck.payload;

  if (Status !== "OK") {
    return res.redirect(302, "/checkout-result?status=failed");
  }

  const result = await verifyPayment({ amount, authority: Authority });
  if (!result.ok) {
    return res.redirect(302, "/checkout-result?status=failed");
  }

  // پرداخت موفق: یک توکن دانلود امن (۲۴ ساعت اعتبار) برای همین سفارش می‌سازیم
  const downloadToken = sign({ bookIds }, "24h");
  const booksParam = encodeURIComponent(bookIds.join(","));

  return res.redirect(
    302,
    `/checkout-result?status=success&token=${encodeURIComponent(downloadToken)}&books=${booksParam}`
  );
}
