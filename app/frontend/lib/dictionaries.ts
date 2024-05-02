import 'server-only';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((data) => data.default),
  ja: () => import('../dictionaries/ja.json').then((data) => data.default),
};

export default async function getDictionary(locale: string) {
  switch (locale) {
    case 'en':
    case 'ja':
      return dictionaries[locale]();
    default:
      return dictionaries['en']();
  }
}