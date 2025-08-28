// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "OZONE Oasis — квартира на Пхукете от собственника",
  description:
    "Квартира на Пхукете, 36 м², Банг Тао. Цена 4.33M ฿ (−1M ฿ от цены застройщика). Фото, контакты, форма заявки.",
  openGraph: {
    title: "OZONE Oasis — квартира на Пхукете",
    description:
      "Квартира на Пхукете, фото, 36 м², Банг Тао. Цена 4.33M ฿ (−1M ฿ от цены застройщика).",
    images: ["/images/phuket-bedroom.jpg"],
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
      <head>
        {/* Google Ads Tag */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17461496470"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17461496470');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}

