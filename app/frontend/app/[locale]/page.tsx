import clsx from 'clsx';

import PageContainer from '@components/PageContainer';
import ChatModule from '@module/Chat';
import getDictionary from '@lib/dictionaries';

type Props = {
  params: { locale: string };
};

export default async function ChatbotPage({ params }: Props) {
  const dictionary = await getDictionary(params.locale);

  return (
    <PageContainer className={clsx('relative')}>
      <h1 className={clsx('font-bold', 'fixed', 'top-0', 'pt-3')}>
        {dictionary.text['title']} (Claude 3 Haiku)
      </h1>

      <ChatModule dictionary={dictionary} locale={params.locale} />
    </PageContainer>
  );
}
