// اتصال به درگاه پرداخت زرین‌پال - مستندات: https://www.zarinpal.com/docs/paymentGateway/

const SANDBOX = process.env.ZARINPAL_SANDBOX === "true";
const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;

const BASE = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4/payment"
  : "https://payment.zarinpal.com/pg/v4/payment";

const STARTPAY = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/StartPay/"
  : "https://www.zarinpal.com/pg/StartPay/";

export async function requestPayment({ amount, description, callbackUrl, email }) {
  const res = await fetch(`${BASE}/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      amount,
      description,
      callback_url: callbackUrl,
      metadata: { email }
    })
  });
  const data = await res.json();

  if (data.data && data.data.code === 100) {
    return { ok: true, authority: data.data.authority, payUrl: STARTPAY + data.data.authority };
  }
  return { ok: false, error: data.errors || "خطا در ایجاد پرداخت" };
}

export async function verifyPayment({ amount, authority }) {
  const res = await fetch(`${BASE}/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ merchant_id: MERCHANT_ID, amount, authority })
  });
  const data = await res.json();

  if (data.data && (data.data.code === 100 || data.data.code === 101)) {
    return { ok: true, refId: data.data.ref_id };
  }
  return { ok: false, error: data.errors || "پرداخت تایید نشد" };
}
