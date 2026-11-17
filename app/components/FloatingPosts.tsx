/**
 * Декоративні «пости» в стилі стрічки Threads, хаотично розкидані навколо пошуку.
 * Тексти й імена вигадані. Показуються лише на стартовому екрані.
 */

interface FakePost {
  user: string;
  time: string;
  text: string;
  likes: number;
  replies: number;
  color: string;
  /** позиція відносно екрана, % */
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  delay: number;
  mobile?: boolean;
}

const POSTS: FakePost[] = [
  { user: "olena.makes", time: "2 год", text: "Замовила вчора ввечері — сьогодні вже забрала. Оце сервіс 🔥", likes: 128, replies: 14, color: "#f4a261", x: 3, y: 6, rotate: -6, scale: 0.92, opacity: 0.9, delay: 0, mobile: true },
  { user: "andrii.codes", time: "5 хв", text: "Хтось ще помітив, що застосунок після оновлення став повільніший?", likes: 42, replies: 31, color: "#5b8def", x: 38, y: 2, rotate: 3, scale: 0.85, opacity: 0.75, delay: 1.2 },
  { user: "kyiv_coffee", time: "1 год", text: "Підтримка відповіла за 3 хвилини і все вирішила. Респект 🙌", likes: 87, replies: 6, color: "#2a9d8f", x: 74, y: 5, rotate: 7, scale: 0.95, opacity: 0.9, delay: 0.6, mobile: true },
  { user: "maria.style", time: "3 год", text: "Чесно? Очікувала більшого за такі гроші 😐", likes: 19, replies: 22, color: "#e76f51", x: 1, y: 40, rotate: 4, scale: 0.88, opacity: 0.8, delay: 2 },
  { user: "ostap.dev", time: "12 хв", text: "Порівнюю три варіанти, поки не визначився. Що порадите?", likes: 7, replies: 48, color: "#8e7dbe", x: 80, y: 36, rotate: -5, scale: 0.9, opacity: 0.85, delay: 0.3 },
  { user: "sofia.reviews", time: "вчора", text: "Третя покупка за місяць і жодного розчарування ❤️", likes: 214, replies: 19, color: "#e5989b", x: 6, y: 72, rotate: -3, scale: 0.97, opacity: 0.9, delay: 1.6, mobile: true },
  { user: "nazar.k", time: "40 хв", text: "Доставка знову запізнюється на два дні. Ну скільки можна 😤", likes: 56, replies: 27, color: "#6c757d", x: 36, y: 80, rotate: 2, scale: 0.88, opacity: 0.8, delay: 0.9 },
  { user: "lviv.daily", time: "6 год", text: "Бачили нову рекламу в метро? Виглядає стильно", likes: 33, replies: 4, color: "#457b9d", x: 72, y: 74, rotate: 6, scale: 0.93, opacity: 0.9, delay: 2.4, mobile: true },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      {POSTS.map((p) => (
        <div
          key={p.user}
          className={`floater${p.mobile ? " floater-mobile" : ""}`}
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
              "--r": `${p.rotate}deg`,
              "--s": p.scale,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        >
          <div className="fp-head">
            <span className="fp-avatar" style={{ background: p.color }}>
              {p.user[0].toUpperCase()}
            </span>
            <span className="fp-user">{p.user}</span>
            <span className="fp-time">{p.time}</span>
            <span className="fp-more">···</span>
          </div>
          <p className="fp-text">{p.text}</p>
          <div className="fp-actions">
            <span>
              <Icon d={HEART} /> {p.likes}
            </span>
            <span>
              <Icon d={REPLY} /> {p.replies}
            </span>
            <Icon d={REPOST} />
            <Icon d={SHARE} />
          </div>
        </div>
      ))}
    </div>
  );
}
