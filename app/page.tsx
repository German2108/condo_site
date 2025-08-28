"use client";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// YouTube-видео: автозапуск только на десктопе
const VIDEO_SRC_BASE = "https://youtu.be/j7AxX7XKyHc?si=qKClSOcUg0gj8oRS";

const DETAILS = {
  title: "Квартира от собственника на Пхукете",
  subtitle: "Видео-интервью с представителем застройщика",
  location: "Пхукет, Таиланд (район: Чонг Талай / Банг Тао)",
  oldPrice: "5,330.000",
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
  const prev = () => setLbIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
  const next = () => setLbIndex((i) => (i + 1) % PHOTOS.length);

  // --- Formspree AJAX submit (без редиректа) ---
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setFormStatus('sending');
      const form = e.currentTarget;
      const data = new FormData(form);
      const res = await fetch(CONTACTS.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (res.ok) {
        setFormStatus('ok');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  }

  // Определяем десктоп для автозапуска видео
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Управление лайтбоксом с клавиатуры + блокировка скролла
  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [lbOpen]);

  // Простые "тесты" в dev-режиме (валидность ссылок и данных)
  useEffect(() => {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') return;
    console.assert(CONTACTS.email.startsWith('mailto:'), 'email mailto: expected');
    console.assert(CONTACTS.whatsapp.startsWith('https://wa.me/'), 'whatsapp link expected');
    console.assert(CONTACTS.formEndpoint.includes('/f/'), 'form endpoint looks invalid');
    console.assert(PHOTOS.length >= 3, 'need at least 3 photos');
    console.assert(VIDEO_SRC_BASE.includes('youtube.com'), 'youtube expected');
  }, []);

  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: DETAILS.title,
    description: `${DETAILS.subtitle}. ${DETAILS.location}. ${DETAILS.size}, ${DETAILS.bedrooms} спальня, ${DETAILS.bathrooms} с/у. Вид: ${DETAILS.view}. Сдача: ${DETAILS.handover}.`,
    brand: DETAILS.project,
    offers: {
      '@type': 'Offer',
      priceCurrency: DETAILS.currency,
      price: '4330000',
      availability: 'https://schema.org/InStock',
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    },
  }), []);

  const oldN = Number((DETAILS.oldPrice || '').replace(/[^0-9]/g, ''));
  const newN = Number((DETAILS.price || '').replace(/[^0-9]/g, ''));
  const savingBadge = oldN && newN && oldN > newN ? 'Специальное предложение' : null;

  const videoSrc = isDesktop ? `${VIDEO_SRC_BASE}?autoplay=1&mute=${muted ? 1 : 0}` : VIDEO_SRC_BASE;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-24 md:pb-0" data-testid="root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-neutral-900 text-white grid place-items-center font-bold">PH</div>
            <div>
              <div className="text-xs sm:text-sm uppercase tracking-wide text-neutral-600" data-testid="project">{DETAILS.project}</div>
              <h1 className="text-base sm:text-lg font-semibold leading-tight" data-testid="title">{DETAILS.title}</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition">WhatsApp</a>
            <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-2xl bg-sky-600 text-white hover:bg-sky-700 transition">Telegram</a>
            <a href={CONTACTS.phone} className="px-4 py-2 rounded-2xl bg-neutral-900 text-white hover:bg-black transition">Позвонить</a>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden relative">
            <div className="aspect-video bg-black/5 relative">
              <iframe
                src={videoSrc}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              {isDesktop && (
                <button onClick={() => setMuted(!muted)} className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 text-white text-sm hover:bg-black" data-testid="mute-btn">
                  {muted ? 'Включить звук' : 'Выключить звук'}
                </button>
              )}
            </div>
            <div className="p-4 md:p-5">
              <h2 className="text-lg md:text-xl font-semibold">{DETAILS.subtitle}</h2>
              <p className="mt-1 text-neutral-600 text-sm">Интервью с представителем застройщика о проекте, условиях и гарантиях.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }} className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 relative" data-testid="price-card">
              {savingBadge && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-600 text-white shadow-sm">
                  {savingBadge}
                  </span>
                 </div>
              )}
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-neutral-600 text-sm">{DETAILS.location}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm sm:text-lg line-through text-neutral-400">{DETAILS.oldPrice}</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{DETAILS.price}</span>
                  </div>
                </div>
                <a href="#contact" className="px-3 sm:px-4 py-2 rounded-2xl bg-neutral-900 text-white hover:bg-black transition text-sm sm:text-base">Забронировать просмотр</a>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <Info label="Площадь" value={DETAILS.size} />
                <Info label="Спальни" value={`${DETAILS.bedrooms}`} />
                <Info label="С/у" value={`${DETAILS.bathrooms}`} />
                <Info label="Этаж" value={`${DETAILS.floor}`} />
                <Info label="Вид" value={DETAILS.view} />
                <Info label="Сдача" value={DETAILS.handover} />
                <Info label="Право" value={DETAILS.ownership} />
              </div>
              <ul className="mt-4 grid gap-2 text-sm list-disc pl-5 text-neutral-700">
                {FEATURES.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PHOTOS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => openLb(i)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    aria-label={`Открыть фото ${i + 1}`}
                  >
                    <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]" />
                  </button>
                ))}
              </div>
            </div>

            {lbOpen && (
              <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm grid place-items-center p-4" onClick={(e) => { if (e.target === e.currentTarget) closeLb(); }}>
                <div className="relative max-w-5xl w-full">
                  <img src={PHOTOS[lbIndex].src} alt={PHOTOS[lbIndex].alt} className="w-full max-h-[80vh] object-contain rounded-xl" />
                  <button aria-label="Закрыть" onClick={(e) => { e.stopPropagation(); closeLb(); }} className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/70 text-white text-xl hover:bg-black">×</button>
                  <button aria-label="Предыдущее фото" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white text-2xl hover:bg-black">‹</button>
                  <button aria-label="Следующее фото" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white text-2xl hover:bg-black">›</button>
                  <div className="mt-2 text-center text-white/80 text-sm">{PHOTOS[lbIndex].alt}</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
          <h3 className="text-lg md:text-xl font-semibold">Описание квартиры</h3>
          <p className="mt-3 text-neutral-700 leading-relaxed text-sm md:text-base">
            Светлая 1-спальная квартира в современном комплексе рядом с пляжем Банг Тао. Идеально подходит для личного проживания и сдачи в аренду.
            Меблировка включена, техника установлена. <strong>Прямой контакт собственника без посредников</strong1>. <span className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">специальное предложение от собственника</span> У комплекса: бассейн, тренажёрный зал, ресепшн, охрана 24/7, парковка.
          </p>
          <p className="mt-3 text-neutral-700 leading-relaxed text-sm md:text-base">
            В видео-интервью выше представитель застройщика рассказывает о гарантиях завершения строительства, статусе лицензий и условиях обслуживания.
            По запросу предоставим брошюру проекта, планировки и финансовую модель доходности.
          </p>
        </motion.div>
      </section>

      <section id="contact" className="max-w-6xl mx-auto px-4 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
          <h3 className="text-lg md:text-xl font-semibold">Связаться с собственником</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition text-sm md:text-base" data-testid="cta-wa">Написать в WhatsApp</a>
              <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 rounded-2xl bg-sky-600 text-white hover:bg-sky-700 transition text-sm md:text-base" data-testid="cta-tg">Написать в Telegram</a>
              <a href={CONTACTS.phone} className="block w-full text-center px-4 py-3 rounded-2xl bg-neutral-900 text-white hover:bg-black transition text-sm md:text-base" data-testid="cta-call">Позвонить</a>
              <a href={CONTACTS.email} className="block w-full text-center px-4 py-3 rounded-2xl bg-neutral-200 text-neutral-900 hover:bg-neutral-300 transition text-sm md:text-base" data-testid="cta-email">Написать на email</a>
              <p className="text-sm text-neutral-600">Быстрый ответ в мессенджерах.</p>
            </div>

            {/* AJAX-форма на Formspree → письмо на herman186198@gmail.com */}
            {formStatus === 'ok' ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900" data-testid="thanks">
                Спасибо! Заявка отправлена. Я свяжусь с вами в ближайшее время.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3" data-testid="form">
                <input type="text" name="name" placeholder="Ваше имя" required className="px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900" />
                <input type="text" name="contact" placeholder="Телефон или мессенджер" required className="px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900" />
                <textarea name="message" placeholder="Сообщение" rows={4} required className="px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900" />
                {/* скрытые поля для удобства в письме */}
                <input type="hidden" name="_subject" value="Заявка с сайта: OZONE Oasis condominium Bang Tao" />
                <button type="submit" disabled={formStatus === 'sending'} className="px-4 py-3 rounded-2xl bg-neutral-900 text-white hover:bg-black transition disabled:opacity-60">
                  {formStatus === 'sending' ? 'Отправка…' : 'Отправить заявку'}
                </button>
                <div className="text-xs text-neutral-500">Отправляя форму, вы соглашаетесь с обработкой персональных данных.</div>
                {formStatus === 'error' && (
                  <div className="text-sm text-red-600">Не удалось отправить. Попробуйте ещё раз или напишите в WhatsApp/Telegram.</div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </section>

      <div className="fixed md:hidden bottom-3 inset-x-3 z-40">
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg p-2 grid grid-cols-3 gap-2">
          <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-center px-3 py-2 rounded-xl bg-green-600 text-white text-sm">WhatsApp</a>
          <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="text-center px-3 py-2 rounded-xl bg-sky-600 text-white text-sm">Telegram</a>
          <a href={CONTACTS.phone} className="text-center px-3 py-2 rounded-xl bg-neutral-900 text-white text-sm">Звонок</a>
        </div>
      </div>

      <footer className="border-t border-neutral-200 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-neutral-600 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Продажа квартиры • {DETAILS.project}</div>
          <div>Собственник: <a href={CONTACTS.phone} className="underline decoration-dotted">связаться</a></div>
        </div>
      </footer>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
