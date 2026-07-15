import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { PAYMENTS_ENABLED } from "../lib/config";

export default function Cart() {
  const cart = useCart();
  const [allBooks, setAllBooks] = useState([]);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setAllBooks)
      .catch(() => setAllBooks([]));
  }, []);

  if (!cart) return null;

  const items = cart.items.map((id) => allBooks.find((b) => b.id === id)).filter(Boolean);
  const total = items.reduce((sum, b) => sum + b.price, 0);

  async function checkoutAll() {
    if (!email || !email.includes("@")) {
      setMsg("لطفاً یک ایمیل معتبر وارد کنید.");
      return;
    }
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookIds: items.map((b) => b.id), email })
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "خطا در ایجاد پرداخت.");
        setLoading(false);
        return;
      }

      window.location.href = data.payUrl;
    } catch {
      setMsg("اتصال به سرور برقرار نشد.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="section">
        <h1>سبد خرید</h1>
        <p className="empty-state">
          سبد خرید شما خالی است. <Link href="/store" className="link">برو به فروشگاه</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="section">
      <h1>سبد خرید</h1>

      <div className="cart-list">
        {items.map((b) => (
          <div className="cart-item" key={b.id}>
            <img src={b.cover} alt={b.title} className="cart-item-cover" />
            <div className="cart-item-info">
              <div className="t">{b.title}</div>
              <div className="a">{b.author}</div>
            </div>
            <div className="cart-item-price">{b.price.toLocaleString("fa-IR")} تومان</div>
            <button className="btn btn-ghost btn-sm" onClick={() => cart.removeItem(b.id)}>حذف</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>مجموع</span>
        <strong>{total.toLocaleString("fa-IR")} تومان</strong>
      </div>

      {!PAYMENTS_ENABLED ? (
        <div className="soon-notice">
          <strong>خرید آنلاین به‌زودی فعال می‌شود.</strong><br />
          کتاب‌ها همین‌جا در سبد شما (در همین مرورگر) نگه داشته می‌شوند تا وقتی پرداخت آنلاین فعال شد.
        </div>
      ) : (
        <div className="form-card">
          <label htmlFor="email">ایمیل شما (لینک دانلود اینجا فعال می‌شود)</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-gold btn-block" onClick={checkoutAll} disabled={loading}>
            {loading ? "در حال اتصال به درگاه پرداخت..." : "پرداخت و دریافت همه"}
          </button>
          {msg && <p className="form-msg">{msg}</p>}
        </div>
      )}
    </div>
  );
}
