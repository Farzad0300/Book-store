import { useEffect, useState } from "react";
import { categoryLabels } from "../../data/books";

const CATS = ["novel", "engineering", "legal", "psychology"];

function emptyForm() {
  return {
    id: "",
    title: "",
    author: "",
    price: 0,
    category: "novel",
    description: "",
    cover: "/covers/scottish-novel-1.svg",
    featured: false,
    published: true,
    fileContent: ""
  };
}

export default function Admin() {
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [checking, setChecking] = useState(true);

  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(null); // null یعنی فرم بسته است
  const [editingId, setEditingId] = useState(null); // null یعنی حالت افزودن
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bookir_admin_token");
    if (saved) {
      setToken(saved);
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    if (token) loadBooks();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function login() {
    setLoginMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginMsg(data.error || "خطا در ورود");
        return;
      }
      localStorage.setItem("bookir_admin_token", data.token);
      setToken(data.token);
    } catch {
      setLoginMsg("اتصال به سرور برقرار نشد.");
    }
  }

  function logout() {
    localStorage.removeItem("bookir_admin_token");
    setToken(null);
  }

  async function loadBooks() {
    const res = await fetch("/api/admin/books", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const data = await res.json();
    setBooks(data);
  }

  function openAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setMsg("");
  }

  function openEdit(book) {
    setForm({ ...book });
    setEditingId(book.id);
    setMsg("");
  }

  function closeForm() {
    setForm(null);
    setEditingId(null);
  }

  async function submitForm() {
    setMsg("");

    if (!form.id || !form.title || !form.author) {
      setMsg("شناسه، عنوان و نویسنده الزامی است.");
      return;
    }

    const isEdit = Boolean(editingId);
    const url = isEdit ? `/api/admin/books/${encodeURIComponent(editingId)}` : "/api/admin/books";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "خطا در ذخیره‌سازی");
        return;
      }

      await loadBooks();
      closeForm();
    } catch {
      setMsg("اتصال به سرور برقرار نشد.");
    }
  }

  async function removeBook(id) {
    if (!confirm(`کتاب «${id}» حذف شود؟ این کار قابل بازگشت نیست.`)) return;

    const res = await fetch(`/api/admin/books/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) loadBooks();
  }

  if (checking) return null;

  if (!token) {
    return (
      <div className="section">
        <div className="form-card" style={{ margin: "60px auto" }}>
          <h3 style={{ marginTop: 0 }}>ورود به پنل مدیریت</h3>
          <label>رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="••••••••"
          />
          {loginMsg && <p className="form-msg">{loginMsg}</p>}
          <button className="btn btn-gold btn-block" onClick={login}>ورود</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-head">
        <h1>پنل مدیریت کتاب‌ها</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-gold btn-sm" onClick={openAdd}>+ افزودن کتاب</button>
          <button className="btn btn-outline btn-sm" onClick={logout}>خروج</button>
        </div>
      </div>

      <div className="admin-table">
        <div className="admin-row admin-row-head">
          <span>عنوان</span>
          <span>نویسنده</span>
          <span>دسته</span>
          <span>قیمت</span>
          <span>وضعیت</span>
          <span></span>
        </div>
        {books.map((b) => (
          <div className="admin-row" key={b.id}>
            <span>{b.title}</span>
            <span>{b.author}</span>
            <span>{categoryLabels[b.category] || b.category}</span>
            <span>{Number(b.price).toLocaleString("fa-IR")}</span>
            <span>
              {!b.published && <em className="tag-soon">به‌زودی</em>}
              {b.published && b.featured && <em className="tag-featured">ویژه</em>}
              {b.published && !b.featured && <em className="tag-normal">منتشرشده</em>}
            </span>
            <span className="admin-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}>ویرایش</button>
              <button className="btn btn-ghost btn-sm" onClick={() => removeBook(b.id)}>حذف</button>
            </span>
          </div>
        ))}
        {books.length === 0 && <p className="empty-state">هنوز کتابی ثبت نشده.</p>}
      </div>

      {form && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="modal" style={{ maxWidth: 520, textAlign: "right" }}>
            <button className="modal-close" onClick={closeForm}>✕</button>
            <h3>{editingId ? "ویرایش کتاب" : "افزودن کتاب جدید"}</h3>
            {msg && <p className="modal-msg">{msg}</p>}

            <label>شناسه (فقط انگلیسی، بدون فاصله)</label>
            <input
              value={form.id}
              disabled={Boolean(editingId)}
              onChange={(e) => setForm({ ...form, id: e.target.value.trim() })}
              placeholder="my-book-slug"
            />

            <label>عنوان</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

            <label>نویسنده</label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />

            <label>قیمت (تومان)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />

            <label>دسته‌بندی</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 6,
                border: "1px solid rgba(237,230,214,0.15)", background: "var(--bg)",
                color: "var(--text)", marginBottom: 16, fontFamily: "inherit", fontSize: 15
              }}
            >
              {CATS.map((c) => (
                <option key={c} value={c}>{categoryLabels[c]}</option>
              ))}
            </select>

            <label>توضیحات</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 6,
                border: "1px solid rgba(237,230,214,0.15)", background: "var(--bg)",
                color: "var(--text)", marginBottom: 16, fontFamily: "inherit", fontSize: 15
              }}
            />

            <label>مسیر عکس جلد (یکی از پوشه‌ی public/covers یا لینک خارجی)</label>
            <input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} />

            <label>محتوای فایل کتاب (نسخه‌ی دمو - بعداً با فایل واقعی جایگزین می‌شود)</label>
            <textarea
              value={form.fileContent || ""}
              onChange={(e) => setForm({ ...form, fileContent: e.target.value })}
              rows={3}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 6,
                border: "1px solid rgba(237,230,214,0.15)", background: "var(--bg)",
                color: "var(--text)", marginBottom: 16, fontFamily: "inherit", fontSize: 15
              }}
            />

            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                style={{ width: "auto", marginBottom: 0 }}
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              کتاب ویژه (در صفحه اصلی نشان داده شود)
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 10 }}>
              <input
                type="checkbox"
                style={{ width: "auto", marginBottom: 0 }}
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              منتشر شده (اگر خاموش باشد، «به‌زودی» نمایش داده می‌شود)
            </label>

            <button className="btn btn-gold btn-block" style={{ marginTop: 20 }} onClick={submitForm}>
              {editingId ? "ذخیره‌ی تغییرات" : "افزودن کتاب"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
