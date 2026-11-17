import HomeClient from "./HomeClient";
import { getLang } from "@/lib/i18n-server";

export default async function Page() {
  const lang = await getLang();
  // key: при зміні мови стан пошуку скидається, щоб тексти оновились
  return <HomeClient key={lang} lang={lang} />;
}
