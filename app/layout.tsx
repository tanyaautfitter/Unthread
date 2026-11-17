import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "BrandPulse — що кажуть про бренд у Threads",
  description: "Введіть назву бренду й дізнайтеся, скільки позитивних, негативних і нейтральних згадок про нього в Threads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
