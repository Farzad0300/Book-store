import { categoryLabels } from "../data/books";
import { getAllBooks, publicFields } from "../lib/store";
import BookCard from "../components/BookCard";

const ORDER = ["novel", "engineering", "legal", "psychology"];

export async function getServerSideProps() {
  const books = await getAllBooks();
  return { props: { books: books.map(publicFields) } };
}

export default function Categories({ books }) {
  return (
    <div className="section">
      <div className="section-head">
        <h1>دسته‌بندی کتاب‌ها</h1>
      </div>

      {ORDER.map((cat) => {
        const list = books.filter((b) => b.category === cat);
        if (list.length === 0) return null;

        return (
          <div key={cat} className="category-block">
            <div className="section-head">
              <h2>{categoryLabels[cat]}</h2>
              <span className="tag">{list.length} کتاب</span>
            </div>
            <div className="grid">
              {list.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
