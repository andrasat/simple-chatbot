import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '300', '400', '600', '700'],
});

export const noto = localFont({
  src: '../public/fonts/NotoSansJP-VariableFont_wght.ttf',
  display: 'swap',
});