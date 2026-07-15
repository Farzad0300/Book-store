import { getBook } from "../../../lib/store";
import { verify } from "../../../lib/token";

export default async function handler(req, res) {
  const { token } = req.query;
  const bookId = req.query.bookId;

  const result = verify(token);
  if (!result.ok) {
    return res
      .status(403)
      .send("لینک دانلود منقضی شده یا نامعتبر است. اگر خرید کرده‌اید، با پشتیبانی تماس بگیرید.");
  }

  // مطمئن می‌شویم این کتاب واقعاً بخشی از همین سفارشِ پرداخت‌شده است
  if (!result.payload.bookIds || !result.payload.bookIds.includes(bookId)) {
    return res.status(403).send("این کتاب در سفارش شما نیست.");
  }

  const book = await getBook(bookId);
  if (!book || !book.published || !book.fileContent) {
    return res.status(404).send("فایل کتاب پیدا نشد.");
  }

  const safeName = encodeURIComponent(`${book.title}.txt`);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="book.txt"; filename*=UTF-8''${safeName}`);
  return res.status(200).send(book.fileContent);
}
