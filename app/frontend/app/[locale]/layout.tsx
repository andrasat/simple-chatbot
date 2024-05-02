import type { Metadata } from 'next';
import { inter } from '../../lib/fonts';
import './globals.css';

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
      <body>
        {children}
        <div id="toast-portal" />
      </body>
    </html>
  );
}
