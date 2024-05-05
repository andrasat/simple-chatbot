import { ChatInput } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function* getWelcomeMsgStream(locale: string) {
  const response = await fetch(`${API_URL}/ai/welcome`, {
    credentials: 'include',
    headers: {
      'accept-language': locale,
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  // Set cookies from the API response
  const cookies = response.headers.get('Set-Cookie');
  if (cookies) {
    document.cookie = cookies;
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');

  for(;;) {
    const { done, value } = await reader?.read()!;
    if (done) break;

    try {
      yield decoder.decode(value);
    } catch {
      //
    }
  }
}

export async function* chatAI(input: ChatInput, locale: string) {
  const body = JSON.stringify(input);
  const response = await fetch(`${API_URL}/ai/haiku`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'accept-language': locale || 'en',
      'content-type': 'application/json',
    },
    body,
  });
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  // Set cookies from the API response
  const cookies = response.headers.get('Set-Cookie');
  if (cookies) {
    document.cookie = cookies;
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  for(;;) {
    const { done, value } = await reader?.read()!;
    if (done) break;

    try {
      const decoded = decoder.decode(value);
      // check if there is a new line
      if (/\n/.test(decoded)) {
        // insert <br> tag
        yield decoded.replace(/\n/g, '<br>');
      } else {
        yield decoded;
      }
    } catch {
      //
    }
  }
}