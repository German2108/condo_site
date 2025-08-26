// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OZONE Oasis — квартира на Пхукете от собственника",
  description:
    "Видео-интервью с застройщиком, 36 м², Банг Тао. Цена 4.33M ฿ (−1M ฿ от застройщика). Фото, контакты, форма заявки.",
  openGraph: {
    title: "OZONE Oasis — квартира на Пхукете",
    description:
      "Видео-интервью, фото, 36 м², Банг Тао. Цена 4.33M ฿ (−1M ฿ от застройщика).",
    images: ["/images/phuket-living.jpg"],
    type: "website",
    url: "https://phuket-condo.org",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://phuket-condo.org"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
