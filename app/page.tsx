"use client";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- Универсальный YouTube embed парсер ---
function toEmbedUrl(input: string): string {
  try {
    const u = new URL(input);
    if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/")[2];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
      return u.toString();
    }
  } catch {}
  return input;
}

const VIDEO_URL = "https://youtu.be/j7AxX7XKyHc?si=qKClSOcUg0gj8oRS";

const DETAILS = {
  title: "Квартира от собственника на Пхукете",
  subtitle: "Видео-интервью с представителем застройщика",
  location: "Пхукет, Таиланд (район: Чонг Талай / Банг Тао)",
  oldPrice: "฿ 5,330,000",
  price: "฿ 4,330,000",
  currency: "THB",
  size: "36м2",
  bedrooms: 1,
  bathrooms: 1,
  floor: 5,
  view: "теннисный корт, сад, виллы OZONE",
  project: "OZONE Oasis condominium Bang Tao",
  handover: "март 2026",
  ownership: "Leasehold/Freehold",
};

const FEATURES = [
  "Пешком до пляжа ~12 минут",
  "Полностью меблирована",
  "Кухня с техникой",
  "Бассейн, фитнес, ресепшн",
  "Охрана 24/7, парковка",
  "Готова к аренде",
  "38 коммерческих помещений (город в городе)",
  "Дороги шириной 12 метров",
];

const CONTACTS = {
  whatsapp: "https://wa.me/79338888198?text=Здравствуйте! Интересует квартира.",
  telegram: "https://t.me/sawadikrab",
  phone: "tel:+66947066687",
  email: "mailto:herman186198@gmail.com?subject=Phuket%20Condo&body=Здравствуйте!%20Пишу%20по%20квартире.",
  formEndpoint: "https://formspree.io/f/mldwrzzn",
};

const PHOTOS = [
  { src: "/images/phuket-bathroom.jpg", alt: "Ванная комната — каменная столешница и зеркало" },
  { src: "/images/phuket-living.jpg", alt: "Гостиная — диван и выход на балкон" },
  { src: "/images/phuket-bedroom.jpg", alt: "Спальня — кровать и панорамные окна" },
];

export default function PhuketCondoLanding() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [muted, setMuted] = useState(true);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const openLb = (i: number) => { setLbIndex(i); setLbOpen(true); };
  const closeLb = () => setLbOpen(false);

  // --- Формируем src для iframe ---
  const videoSrc = useMemo(() => {
    const base = new URL(toEmbedUrl(VIDEO_URL));
    if (isDesktop) {
      base.searchParams.set("autoplay", "1");
      base.searchParams.set("mute", muted ? "1" : "0");
    }
    base.searchParams.set("playsinline", "1");
    base.searchParams.set("modestbranding", "1");
    base.searchParams.set("rel", "0");
    return base.toString();
  }, [isDesktop, muted]);

  // Определяем десктоп для автозапуска
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const oldN = Number((DETAILS.oldPrice || "").replace(/[^0-9]/g, ""));
  const newN = Number((DETAILS.price || "").replace(/[^0-9]/g, ""));
  const savingBadge = oldN && newN && oldN > newN ? "Специальное предложение" : null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <motion.div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden relative">
          <div className="aspect-video bg-black/5 relative">
            <iframe
              src={videoSrc}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
            {isDesktop && (
              <button
                onClick={() => setMuted(!muted)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 text-white text-sm"
              >
                {muted ? "Включить звук" : "Выключить звук"}
              </button>
            )}
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 relative">
          {savingBadge && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-emerald-600 text-white shadow-sm">
                {savingBadge}
              </span>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="text-neutral-600 text-sm">{DETAILS.location}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-sm line-through text-neutral-400">{DETAILS.oldPrice}</span>
                <span className="text-2xl font-extrabold text-emerald-700">{DETAILS.price}</span>
              </div>
            </div>
            <a href="#contact" className="px-4 py-2 rounded-2xl bg-neutral-900 text-white hover:bg-black">
              Забронировать просмотр
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}