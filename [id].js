import { useState } from "react";
import { getBook, publicFields } from "../../lib/store";
import { useCart } from "../../context/CartContext";
import { PAYMENTS_ENABLED } from "../../lib/config";

export async function getServerSideProps({ params }) {
  const book = await getBook(params.id);
  if (!book) return { notFound: true };
  return { props: { book: publicFields(book) } };
}

export default function BookDetail({ book }) {
  const cart = useCart();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const inCart = cart && cart.items.includes(book.id);

  async function buyNow() {
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
        body: JSON.stringify({ bookIds: [book.id], email })
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

  return (
    <div className="product">
      <div className="product-cover">
        <img src={book.cover} alt={`جلد کتاب ${book.title}`} />
      </div>
      <div>
        <h1>{book.title}</h1>
        <div className="author">نوشته‌ی {book.author}</div>
        <p className="desc">{book.description}</p>

        {!book.published ? (
          <div className="soon-notice">
            <strong>به‌زودی منتشر می‌شود.</strong><br />
            این کتاب هنوز برای خرید در دسترس نیست.
          </div>
        ) : !PAYMENTS_ENABLED ? (
          <>
            <div className="price">{book.price.toLocaleString("fa-IR")} تومان</div>
            <div className="soon-notice">
              <strong>خرید آنلاین به‌زودی فعال می‌شود.</strong><br />
              می‌توانید این کتاب را به سبد خرید اضافه کنید تا وقتی پرداخت آنلاین فعال شد، راحت خریدش کنید.
            </div>
            <button
              className="btn btn-outline btn-block"
              style={{ marginTop: 14 }}
              disabled={inCart}
              onClick={() => cart.addItem(book.id)}
            >
              {inCart ? "در سبد خرید است" : "افزودن به سبد خرید"}
            </button>
          </>
        ) : (
          <>
            <div className="price">{book.price.toLocaleString("fa-IR")} تومان</div>

            <div className="form-card">
              <label htmlFor="email">ایمیل شما (لینک دانلود اینجا فعال می‌شود)</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-gold btn-block" onClick={buyNow} disabled={loading}>
                {loading ? "در حال اتصال به درگاه پرداخت..." : "خرید مستقیم و دانلود"}
              </button>
              <button
                className="btn btn-outline btn-block"
                style={{ marginTop: 10 }}
                disabled={inCart}
                onClick={() => cart.addItem(book.id)}
              >
                {inCart ? "در سبد خرید است" : "افزودن به سبد خرید"}
              </button>
              {msg && <p className="form-msg">{msg}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
