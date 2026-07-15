import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";

export default function CheckoutResult() {
  const router = useRouter();
  const { status, token, books: booksParam } = router.query;
  const cart = useCart();
  const cleared = useRef(false);
  const [purchased, setPurchased] = useState([]);

  const purchasedIds = typeof booksParam === "string" ? booksParam.split(",") : [];

  useEffect(() => {
    if (purchasedIds.length === 0) return;
    fetch("/api/books")
      .then((r) => r.json())
      .then((all) => setPurchased(all.filter((b) => purchasedIds.includes(b.id))))
      .catch(() => setPurchased([]));
  }, [booksParam]); // eslint-disable-line react-hooks/exhaustive-deps

  // بعد از پرداخت موفق، همان کتاب‌ها را از سبد خرید پاک می‌کنیم
  useEffect(() => {
    if (status === "success" && cart && !cleared.current) {
      purchasedIds.forEach((id) => cart.removeItem(id));
      cleared.current = true;
    }
  }, [status, cart]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!router.isReady) return null;

  if (status === "success" && token) {
    return (
      <div className="result-box">
        <div className="status-icon status-success">✓</div>
        <h1>پرداخت با موفقیت انجام شد</h1>
        <p>کتاب‌های شما آماده‌ی دانلودند. لینک‌ها محدود به زمانند، همین حالا دانلود کنید.</p>

        <div className="download-list">
          {purchased.map((b) => (
            <a
              key={b.id}
              className="btn btn-gold"
              style={{ margin: "6px" }}
              href={`/api/download/${encodeURIComponent(token)}?bookId=${encodeURIComponent(b.id)}`}
            >
              دانلود «{b.title}»
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="result-box">
        <div className="status-icon status-error">✕</div>
        <h1>پرداخت ناموفق بود</h1>
        <p>مبلغی از حساب شما کسر نشده است. می‌توانید دوباره تلاش کنید.</p>
        <a className="btn btn-outline" href="/store">بازگشت به فروشگاه</a>
      </div>
    );
  }

  return (
    <div className="result-box">
      <div className="status-icon status-error">؟</div>
      <h1>خطایی رخ داد</h1>
      <p>وضعیت پرداخت مشخص نیست. اگر مبلغی کسر شده، با پشتیبانی تماس بگیرید.</p>
      <a className="btn btn-outline" href="/store">بازگشت به فروشگاه</a>
    </div>
  );
}
