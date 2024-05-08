import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { CallbackManager } from './types';

interface DocumentCallbackManager extends CallbackManager {
  onProgress: (loaded: number, total: number) => void
}

async function pdfToText(buffer: ArrayBuffer, cbm?: DocumentCallbackManager) {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
  GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';

  const Task = getDocument(buffer);
  if (cbm?.onProgress) Task.onProgress = cbm.onProgress;

  const document = await Task.promise;

  const waitOnPages: Promise<string>[] = [];
  const pages = document.numPages;
  for (let index = 1; index <= pages; index++) {
    waitOnPages.push(new Promise(async (resolve) => {
      const page = await document.getPage(index);

      try {
        const content = await page.getTextContent();

        const textContent = content.items
          .filter((item): item is TextItem => 'str' in item)
          .map(item => item.str)
          .join('');

        return  resolve(textContent);
      } catch {
        return '';
      } finally {
        page.cleanup();
      }
    }));
  }

  const textContents = await Promise.allSettled(waitOnPages);
  const pdfText = textContents.map(item => item.status === 'fulfilled' ? item.value : '').join('\n');
  return pdfText;
}

export default pdfToText;
