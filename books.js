// کاتالوگ کتاب‌ها. برای اضافه/ویرایش کتاب، همین فایل را ویرایش کنید.
// category یکی از این مقادیر است: "novel" | "engineering" | "legal" | "psychology"
//
// نکته امنیتی: fileContent هرگز نباید مستقیم به فرانت‌اند فرستاده شود -
// فقط از داخل pages/api/download بعد از تایید توکن پرداخت خوانده می‌شود.

const books = [
  // ---------------- رمان ----------------
  {
    id: "shayad-ou-man-bashad",
    title: "شاید او من باشد",
    author: "فرزاد باقری مهدیرجی",
    price: 45000,
    category: "novel",
    description: "رمانی فلسفی و تاریک درباره‌ی هویت، حافظه، و مرز باریک میان واقعیت و تصویری که از خودمان می‌سازیم.",
    cover: "/covers/shayad-ou-man-bashad.svg",
    featured: true,
    published: false,
    fileContent: null
  },
  {
    id: "scottish-novel-1",
    title: "رمان اسکاتلندی - جلد اول",
    author: "فرزاد باقری مهدیرجی",
    price: 60000,
    category: "novel",
    description: "داستانی سینمایی در فضای سرد و مه‌آلود اسکاتلند، در دل جنگ و مبارزه‌ای که هیچ‌کس برنده‌ی واقعی‌اش نیست.",
    cover: "/covers/scottish-novel-1.svg",
    featured: true,
    published: true,
    fileContent: "رمان اسکاتلندی - جلد اول\nنوشته: فرزاد باقری مهدیرجی\n\n--- فایل نمونه ---"
  },
  {
    id: "hezartooye-zehn",
    title: "هزارتوی ذهن",
    author: "سارا احمدی",
    price: 45000,
    category: "novel",
    description: "رمانی درباره‌ی مسیرهای پیچیده‌ی تصمیم‌گیری در زندگی مدرن. راوی در هزارتویی از خاطرات و انتخاب‌های ناتمام گم می‌شود.",
    cover: "/covers/hezartooye-zehn.svg",
    featured: true,
    published: true,
    fileContent: "هزارتوی ذهن\nنوشته: سارا احمدی\n\n--- فایل نمونه ---"
  },
  {
    id: "sayehaye-kashi",
    title: "سایه‌های کاشی",
    author: "آرش نوروزی",
    price: 52000,
    category: "novel",
    description: "یک داستان جنایی در دل تهران قدیم. کارآگاهی که به دنبال قاتلی می‌گردد که رد پایش را فقط روی کاشی‌های خانه‌های متروک به جا می‌گذارد.",
    cover: "/covers/sayehaye-kashi.svg",
    featured: false,
    published: true,
    fileContent: "سایه‌های کاشی\nنوشته: آرش نوروزی\n\n--- فایل نمونه ---"
  },
  {
    id: "baran-rooye-ostokhan",
    title: "باران روی استخوان",
    author: "نگار فرودین",
    price: 49000,
    category: "novel",
    description: "داستان سه نسل از زنان یک خانواده در شمال ایران، روایتی از عشق، از دست دادن، و باران‌هایی که هیچ‌وقت بند نمی‌آیند.",
    cover: "/covers/baran-rooye-ostokhan.svg",
    featured: false,
    published: true,
    fileContent: "باران روی استخوان\nنوشته: نگار فرودین\n\n--- فایل نمونه ---"
  },
  {
    id: "akharin-ghatar",
    title: "آخرین قطار به اسفندماه",
    author: "کاوه رستمی",
    price: 55000,
    category: "novel",
    description: "در آینده‌ای نزدیک، آخرین قطار مسافربری کشور فقط یک بار در سال حرکت می‌کند. رمانی علمی-تخیلی درباره‌ی زمان و آخرین فرصت‌ها.",
    cover: "/covers/akharin-ghatar.svg",
    featured: false,
    published: true,
    fileContent: "آخرین قطار به اسفندماه\nنوشته: کاوه رستمی\n\n--- فایل نمونه ---"
  },

  // ---------------- مهندسی ----------------
  {
    id: "mabani-mohandesi-narmafzar",
    title: "مبانی مهندسی نرم‌افزار",
    author: "رضا کریمی",
    price: 68000,
    category: "engineering",
    description: "راهنمای عملی طراحی و ساخت نرم‌افزار برای مبتدیانی که می‌خواهند حرفه‌ای شوند؛ از معماری تا تست.",
    cover: "/covers/mabani-mohandesi-narmafzar.svg",
    featured: true,
    published: true,
    fileContent: "مبانی مهندسی نرم‌افزار\nنوشته: رضا کریمی\n\n--- فایل نمونه ---"
  },
  {
    id: "moghadame-hoosh-masnooi",
    title: "مقدمه‌ای بر هوش مصنوعی",
    author: "سپهر مرادی",
    price: 72000,
    category: "engineering",
    description: "آشنایی با مفاهیم پایه‌ی یادگیری ماشین و هوش مصنوعی، بدون نیاز به پیش‌زمینه‌ی سنگین ریاضی.",
    cover: "/covers/moghadame-hoosh-masnooi.svg",
    featured: false,
    published: true,
    fileContent: "مقدمه‌ای بر هوش مصنوعی\nنوشته: سپهر مرادی\n\n--- فایل نمونه ---"
  },
  {
    id: "tarahi-madar-electronic",
    title: "طراحی مدارهای الکترونیک",
    author: "آرمان یوسفی",
    price: 65000,
    category: "engineering",
    description: "از مبانی مدارهای آنالوگ تا طراحی برد و عیب‌یابی؛ یک راهنمای کاربردی برای دانشجویان و علاقه‌مندان.",
    cover: "/covers/tarahi-madar-electronic.svg",
    featured: false,
    published: true,
    fileContent: "طراحی مدارهای الکترونیک\nنوشته: آرمان یوسفی\n\n--- فایل نمونه ---"
  },

  // ---------------- حقوقی ----------------
  {
    id: "hoghough-madani-sade",
    title: "حقوق مدنی به زبان ساده",
    author: "علیرضا حسینی",
    price: 58000,
    category: "legal",
    description: "توضیح مفاهیم اصلی حقوق مدنی با زبانی روان و مثال‌های واقعی، مناسب برای عموم و دانشجویان حقوق.",
    cover: "/covers/hoghough-madani-sade.svg",
    featured: true,
    published: true,
    fileContent: "حقوق مدنی به زبان ساده\nنوشته: علیرضا حسینی\n\n--- فایل نمونه ---"
  },
  {
    id: "rahnamaye-gharardad",
    title: "راهنمای قراردادهای تجاری",
    author: "نیلوفر رضایی",
    price: 62000,
    category: "legal",
    description: "نکات کلیدی برای نوشتن و بررسی قراردادهای تجاری، همراه با اشتباهات رایج و راه‌های پیشگیری از آن‌ها.",
    cover: "/covers/rahnamaye-gharardad.svg",
    featured: false,
    published: true,
    fileContent: "راهنمای قراردادهای تجاری\nنوشته: نیلوفر رضایی\n\n--- فایل نمونه ---"
  },
  {
    id: "ashnayi-hoghough-kar",
    title: "آشنایی با حقوق کار",
    author: "بابک شریفی",
    price: 54000,
    category: "legal",
    description: "حقوق و وظایف کارگر و کارفرما در قانون کار ایران، به‌همراه پرسش و پاسخ‌های رایج.",
    cover: "/covers/ashnayi-hoghough-kar.svg",
    featured: false,
    published: true,
    fileContent: "آشنایی با حقوق کار\nنوشته: بابک شریفی\n\n--- فایل نمونه ---"
  },

  // ---------------- روانشناسی ----------------
  {
    id: "zaban-badan",
    title: "زبان بدن در روابط روزمره",
    author: "دکتر شیرین علوی",
    price: 48000,
    category: "psychology",
    description: "چطور از حرکات بدن، دیگران و خودمان را بهتر بشناسیم؛ راهنمایی کاربردی برای روابط شخصی و کاری.",
    cover: "/covers/zaban-badan.svg",
    featured: true,
    published: true,
    fileContent: "زبان بدن در روابط روزمره\nنوشته: دکتر شیرین علوی\n\n--- فایل نمونه ---"
  },
  {
    id: "zehne-aram",
    title: "ذهن آرام، زندگی روشن",
    author: "پیمان کاظمی",
    price: 46000,
    category: "psychology",
    description: "تکنیک‌های ساده‌ی ذهن‌آگاهی برای کاهش اضطراب روزمره و داشتن ذهنی آرام‌تر.",
    cover: "/covers/zehne-aram.svg",
    featured: false,
    published: true,
    fileContent: "ذهن آرام، زندگی روشن\nنوشته: پیمان کاظمی\n\n--- فایل نمونه ---"
  },
  {
    id: "raftarshenasi-kodak",
    title: "رفتارشناسی کودک",
    author: "مهسا توکلی",
    price: 51000,
    category: "psychology",
    description: "راهنمای والدین برای درک بهتر رفتار کودکان در سنین مختلف و واکنش درست به آن‌ها.",
    cover: "/covers/raftarshenasi-kodak.svg",
    featured: false,
    published: true,
    fileContent: "رفتارشناسی کودک\nنوشته: مهسا توکلی\n\n--- فایل نمونه ---"
  }
];

export default books;

export const categoryLabels = {
  novel: "رمان",
  engineering: "مهندسی",
  legal: "حقوقی",
  psychology: "روانشناسی"
};
