/**
 * Декоративний фон стартового екрана: купа карток у стилі постів Threads,
 * накладених одна на одну, і чорні діагональні стрічки з текстом позаду.
 * Тексти вигадані, імен людей немає. Генерація детермінована (seed),
 * тож сервер і браузер малюють однакову картинку.
 */

const TEXTS = [
  "Замовила вчора ввечері — сьогодні вже забрала. Оце сервіс 🔥",
  "Хтось ще помітив, що застосунок після оновлення став повільніший?",
  "Підтримка відповіла за 3 хвилини і все вирішила. Респект 🙌",
  "Чесно? Очікувала більшого за такі гроші 😐",
  "Порівнюю три варіанти, поки не визначився. Що порадите?",
  "Третя покупка за місяць і жодного розчарування ❤️",
  "Доставка знову запізнюється на два дні. Ну скільки можна 😤",
  "Бачили нову рекламу в метро? Виглядає стильно",
  "Де ваше улюблене місце на вихідні? Шукаю щось нове",
  "Нарешті кава, яка не гірчить ☕",
  "Обслуговування просто топ, повернусь ще",
  "Ціни підняли, а якість та сама 🤷",
  "Скажіть чесно, воно того варте?",
  "Взяла на пробу — тепер беру постійно",
  "Ніколи не думала, що напишу відгук, але мушу",
  "Чому ніхто не говорить, наскільки це зручно?",
];

const IMG_COLORS = [
  ["#d9a066", "#b9773c"],
  ["#3b3b3b", "#8a6d4b"],
  ["#c9d6df", "#7c98ab"],
  ["#e8c4b8", "#b07d6a"],
];

interface Card {
  id: number;
  x: number;
  y: number;
  rotate: number;
  z: number;
  text: string;
  likes: number;
  replies: number;
  time: string;
  images: number;
  side: boolean;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const TIMES = ["2 хв", "12 хв", "40 хв", "1 год", "3 год", "6 год", "вчора", "2 д"];

function buildCards(count: number): Card[] {
  const rand = rng(17);
  const cards: Card[] = [];
  let guard = 0;
  while (cards.length < count && guard < 5000) {
    guard++;
    // ліва верхня точка картки у % від ширини/висоти екрана
    const x = -6 + rand() * 96;
    const y = -8 + rand() * 98;
    // картка ≈ 20% ширини і 20% висоти; тримаємо центр вільним для заголовка і пошуку
    const overlapsCenter = x + 18 > 21 && x < 79 && y + 18 > 24 && y < 66;
    if (overlapsCenter) continue;
    const i = cards.length;
    cards.push({
      id: i,
      x,
      y,
      rotate: Math.round((rand() * 2 - 1) * 14),
      z: Math.floor(rand() * 100),
      text: TEXTS[Math.floor(rand() * TEXTS.length)],
      likes: Math.floor(rand() * 400),
      replies: Math.floor(rand() * 60),
      time: TIMES[Math.floor(rand() * TIMES.length)],
      images: rand() < 0.3 ? 2 : 0,
      side: y + 18 > 20 && y < 70,
    });
  }
  return cards;
}

const CARDS = buildCards(44);

const RIBBONS = [
  { cls: "rb-1", text: "UNTHREAD • ЩО КАЖУТЬ ПРО БРЕНД • " },
  { cls: "rb-2", text: "BRAND CHECK • THREADS • ВІДГУКИ • " },
  { cls: "rb-3", text: "ПОЗИТИВ • НЕГАТИВ • НЕЙТРАЛ • " },
  { cls: "rb-4", text: "UNTHREAD • BRAND • CHECK • " },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const HEART = "M12 20s-7-4.4-9.3-8.6C1.2 8.6 2.6 5 6 5c2 0 3.2 1.1 4 2.3h4C14.8 6.1 16 5 18 5c3.4 0 4.8 3.6 3.3 6.4C19 15.6 12 20 12 20Z";
const REPLY = "M20 12a8 8 0 1 1-3.3-6.5L20 4l-.8 3.9A8 8 0 0 1 20 12Z";
const REPOST = "M7 7h10l-2.5-2.5M17 17H7l2.5 2.5M17 7v4M7 17v-4";
const SHARE = "M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z";

export default function FloatingPosts() {
  return (
    <div className="floaters" aria-hidden="true">
      {RIBBONS.map((r) => (
        <div key={r.cls} className={`ribbon ${r.cls}`}>
          <span>{r.text.repeat(6)}</span>
        </div>
      ))}

      {CARDS.map((c) => (
        <div
          key={c.id}
          className={`floater${c.side ? " floater-side" : ""}${c.id >= 22 ? " floater-extra" : ""}`}
          style={
            {
              left: `${c.x}%`,
              top: `${c.y}%`,
              zIndex: 2 + c.z,
              "--r": `${c.rotate}deg`,
              animationDelay: `${(c.id % 9) * 0.7}s`,
            } as React.CSSProperties
          }
        >
          <div className="fp-head">
            <span className="fp-avatar" />
            <span className="fp-name" />
            <span className="fp-time">{c.time}</span>
            <span className="fp-more">···</span>
          </div>
          <p className="fp-text">{c.text}</p>
          {c.images > 0 && (
            <div className="fp-images">
              {IMG_COLORS.slice(c.id % 3, (c.id % 3) + 2).map(([a, b]) => (
                <span key={a} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />
              ))}
            </div>
          )}
          <div className="fp-actions">
            <span>
              <Icon d={HEART} /> {c.likes}
            </span>
            <span>
              <Icon d={REPLY} /> {c.replies}
            </span>
            <Icon d={REPOST} />
            <Icon d={SHARE} />
          </div>
        </div>
      ))}
    </div>
  );
}
