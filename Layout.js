import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import AuthModal from "./AuthModal";
import { PAYMENTS_ENABLED } from "../lib/config";

export default function Layout({ children }) {
  const cart = useCart();
  const [session, setSession] = useState(null);
  const [modalMode, setModalMode] = useState(null); // null | "login" | "signup"

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bookir_session") || "null");
      setSession(saved);
    } catch {
      setSession(null);
    }
  }, []);

  function logout() {
    localStorage.removeItem("bookir_session");
    setSession(null);
  }

  const cartCount = cart ? cart.items.length : 0;

  return (
    <div className="app">
      <Head>
        <title>کتابخانه شب | فروشگاه کتاب الکترونیک</title>
        <meta name="description" content="کتابخانه شب — فروشگاه کتاب الکترونیک با رمان، کتاب مهندسی، حقوقی و روان‌شناسی." />
      </Head>

      {!PAYMENTS_ENABLED && (
        <div className="announce-bar">
          کتابخانه شب به‌زودی امکان خرید آنلاین کامل را فعال می‌کند — فعلاً در حال آماده‌سازی
        </div>
      )}

      <header className="header">
        <Link href="/" className="logo">کتابخانه<span> شب</span></Link>
        <nav className="nav">
          <Link href="/">خانه</Link>
          <Link href="/store">فروشگاه</Link>
          <Link href="/categories">دسته‌بندی</Link>
          <Link href="/cart">
            سبد خرید{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
        </nav>
        <div className="header-actions">
          {session ? (
            <>
              <span className="user-chip">خوش آمدید، <strong>{session.name}</strong></span>
              <button className="btn btn-outline btn-sm" onClick={logout}>خروج</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setModalMode("login")}>ورود</button>
              <button className="btn btn-gold btn-sm" onClick={() => setModalMode("signup")}>ثبت‌نام</button>
            </>
          )}
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        <div className="footer-inner">
          <span>
            © {new Date().getFullYear()} کتابخانه شب — bookir.site ·{" "}
            <Link href="/admin" className="admin-link">مدیریت</Link>
          </span>
          <a
            referrerPolicy="origin"
            target="_blank"
            rel="noreferrer"
            href="https://trustseal.enamad.ir/?id=758557&Code=jpWrokImTUPJvl6cxQWjmG80uSlI8TWL"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=758557&Code=jpWrokImTUPJvl6cxQWjmG80uSlI8TWL"
              alt="نماد اعتماد الکترونیکی"
              className="enamad-badge"
            />
          </a>
        </div>
      </footer>

      {modalMode && (
        <AuthModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onAuthed={(user) => {
            setSession(user);
            setModalMode(null);
          }}
        />
      )}
    </div>
  );
}
