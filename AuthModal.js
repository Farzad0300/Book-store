import { useState } from "react";

// نکته مهم: این فقط یک شبیه‌سازی سمت مرورگر است، نه سیستم احراز هویت واقعی.
// اطلاعات در localStorage ذخیره می‌شود و رمز عبور رمزنگاری نمی‌شود.
// برای سایت واقعی این بخش باید با یک بک‌اند امن جایگزین شود.

export default function AuthModal({ mode, onClose, onAuthed }) {
  const [tab, setTab] = useState(mode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem("bookir_users") || "[]");
    } catch {
      return [];
    }
  }

  function submit() {
    if (!email || !email.includes("@") || !pass) {
      setMsg("ایمیل و رمز عبور را کامل وارد کنید.");
      return;
    }

    const users = getUsers();

    if (tab === "signup") {
      if (!name) {
        setMsg("نام را وارد کنید.");
        return;
      }
      if (users.find((u) => u.email === email)) {
        setMsg("این ایمیل قبلاً ثبت‌نام کرده است.");
        return;
      }
      const newUsers = [...users, { name, email, pass }];
      localStorage.setItem("bookir_users", JSON.stringify(newUsers));
      localStorage.setItem("bookir_session", JSON.stringify({ name, email }));
      onAuthed({ name, email });
    } else {
      const user = users.find((u) => u.email === email && u.pass === pass);
      if (!user) {
        setMsg("ایمیل یا رمز عبور اشتباه است.");
        return;
      }
      localStorage.setItem("bookir_session", JSON.stringify(user));
      onAuthed(user);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-tabs">
          <div
            className={`modal-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setMsg(""); }}
          >
            ورود
          </div>
          <div
            className={`modal-tab ${tab === "signup" ? "active" : ""}`}
            onClick={() => { setTab("signup"); setMsg(""); }}
          >
            ثبت‌نام
          </div>
        </div>

        <h3>{tab === "signup" ? "ساخت حساب جدید" : "ورود به حساب"}</h3>
        <p className="sub">این یک نسخه‌ی دمو است، اطلاعات فقط در همین مرورگر ذخیره می‌شود.</p>
        <p className="modal-msg">{msg}</p>

        {tab === "signup" && (
          <>
            <label>نام</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام شما" />
          </>
        )}

        <label>ایمیل</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

        <label>رمز عبور</label>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />

        <button className="btn btn-gold btn-block" onClick={submit}>
          {tab === "signup" ? "ثبت‌نام" : "ورود"}
        </button>
      </div>
    </div>
  );
}
