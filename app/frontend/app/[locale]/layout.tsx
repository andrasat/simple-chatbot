import type { Metadata } from 'next';
import Script from 'next/script';
import { inter } from '../../lib/fonts';
import './globals.css';

const NEXT_PUBLIC_FONTAWESOME_KIT_URL =
  process.env.NEXT_PUBLIC_FONTAWESOME_KIT_URL;

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export const metadata: Metadata = {
  title: 'Chatbot Assistant',
  description: 'AI Chatbot Assistant',
};

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ja' }];
}

export default function RootLayout({ children, params }: Readonly<Props>) {
  return (
    <html lang={params.locale || 'en'} className={inter.className}>
      <head>
        {NEXT_PUBLIC_FONTAWESOME_KIT_URL && (
          <Script
            src={NEXT_PUBLIC_FONTAWESOME_KIT_URL}
            crossOrigin="anonymous"
          />
        )}
      </head>

      <body>
        {children}
        <div id="toast-portal" />
      </body>
    </html>
  );
}
