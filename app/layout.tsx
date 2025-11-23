import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Analytics from "@/components/Analytics";
// import DatadogRUM from "@/components/DatadogRUM"; // Uncomment after installing @datadog/browser-rum

export const metadata: Metadata = {
  title: {
    default: "LifeHacks - Делись полезными советами",
    template: "%s | LifeHacks"
  },
  description: "Платформа для обмена лайфхаками между парнями. Делитесь полезными советами, оценивайте лучшие идеи и находите решения для повседневных задач.",
  keywords: ["лайфхаки", "советы", "полезные советы", "лайфхаки для парней", "полезные идеи", "хитрости", "советы для жизни"],
  authors: [{ name: "LifeHacks Team" }],
  creator: "LifeHacks",
  publisher: "LifeHacks",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "LifeHacks - Делись полезными советами",
    description: "Платформа для обмена лайфхаками. Делитесь советами, оценивайте идеи других пользователей.",
    url: "https://lifehacks.com",
    siteName: "LifeHacks",
    locale: "ru_RU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className="antialiased bg-gray-50 flex flex-col min-h-screen font-sans"
      >
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </Providers>
        <Analytics />
        {/* <DatadogRUM /> */} {/* Uncomment after installing @datadog/browser-rum */}
      </body>
    </html>
  );
}
