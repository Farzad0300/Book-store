import fs from "fs";
import path from "path";
import seedBooks from "../data/books";

const KEY = "all-books";
const LOCAL_FILE = path.join(process.cwd(), ".data", "books.json");

// این پروژه در دو حالت کار می‌کند:
// - روی Netlify (پروداکشن): از Netlify Blobs استفاده می‌شود، ذخیره‌سازی خودکار و دائمی، بدون تنظیم اضافه.
// - روی سیستم خودتان (npm run dev): چون Netlify Blobs بیرون از محیط Netlify در دسترس نیست،
//   به‌صورت خودکار روی یک فایل محلی (.data/books.json) ذخیره می‌شود تا بتوانید پنل را تست کنید.

async function getBlobStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore("bookir-books");
}

function readLocal() {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8"));
  } catch {
    return null;
  }
}

function writeLocal(books) {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(books, null, 2));
}

export async function getAllBooks() {
  try {
    const store = await getBlobStore();
    const data = await store.get(KEY, { type: "json" });
    if (data) return data;
    await store.setJSON(KEY, seedBooks);
    return seedBooks;
  } catch {
    // خارج از محیط Netlify هستیم (مثلاً npm run dev) - از فایل محلی استفاده می‌کنیم
    const local = readLocal();
    if (local) return local;
    writeLocal(seedBooks);
    return seedBooks;
  }
}

export async function saveAllBooks(books) {
  try {
    const store = await getBlobStore();
    await store.setJSON(KEY, books);
  } catch {
    writeLocal(books);
  }
}

export async function getBook(id) {
  const books = await getAllBooks();
  return books.find((b) => b.id === id) || null;
}

export async function upsertBook(book) {
  const books = await getAllBooks();
  const idx = books.findIndex((b) => b.id === book.id);
  if (idx >= 0) books[idx] = book;
  else books.push(book);
  await saveAllBooks(books);
  return book;
}

export async function deleteBook(id) {
  const books = await getAllBooks();
  const filtered = books.filter((b) => b.id !== id);
  await saveAllBooks(filtered);
  return filtered;
}

// این فیلد هیچ‌وقت نباید به فرانت‌اند عمومی (غیر از پنل مدیریت) برگردد
export function publicFields(book) {
  const { fileContent, ...rest } = book;
  return rest;
}
