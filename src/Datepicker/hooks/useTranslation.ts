import * as ru_lang from '../langs/ru.json';
import * as en_lang from '../langs/en.json';
import * as fr_lang from '../langs/fr.json';
import { LangJSON, TLang } from '../interfaces.ts';

export function useTranslation(lang: TLang) {
  const ruLangData: LangJSON = ru_lang;
  const enLangData: LangJSON = en_lang;
  const frLangData: LangJSON = fr_lang;
  function t(value: string) {
    switch (lang) {
      case 'ru':
        return ruLangData[value];
      case 'en':
        return enLangData[value];
      case 'fr':
        return frLangData[value];
    }
  }
  return { t };
}
