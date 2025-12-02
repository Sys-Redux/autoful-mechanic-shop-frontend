import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from '../components/providers/StoreProvider';
import QueryProvider from '../components/providers/QueryProvider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Autoful - Mechanic Shop Management",
    template: "%s | Autoful",
  },
  description: 'Professional autoshop management software to streamline your operations and enhance customer satisfaction.',
  keywords: ['mechanic', 'auto shop', 'inventory management', 'service tickets', 'automotive']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <StoreProvider>
          <QueryProvider>
            {children}
            <Toaster
              position='top-right'
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                className: 'font-sans',
              }}
            />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
