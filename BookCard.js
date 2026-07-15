import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function BookCard({ book }) {
  const cart = useCart();
  const inCart = cart && cart.items.includes(book.id);

  return (
    <div className="book-card">
      <Link href={`/book/${book.id}`} className="book-cover-link">
        <img src={book.cover} alt={`جلد کتاب ${book.title}`} className="book-cover" />
        {!book.published && <span className="badge badge-soon">به‌زودی</span>}
        {book.published && book.featured && <span className="badge badge-featured">ویژه</span>}
      </Link>
      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>
      {book.published ? (
        <>
          <p className="price">{book.price.toLocaleString("fa-IR")} تومان</p>
          <div className="card-actions">
            <Link href={`/book/${book.id}`} className="btn btn-outline btn-sm">مشاهده</Link>
            <button
              className="btn btn-gold btn-sm"
              disabled={inCart}
              onClick={() => cart.addItem(book.id)}
            >
              {inCart ? "در سبد است" : "افزودن به سبد"}
            </button>
          </div>
        </>
      ) : (
        <p className="soon-label">به‌زودی منتشر می‌شود</p>
      )}
    </div>
  );
}
