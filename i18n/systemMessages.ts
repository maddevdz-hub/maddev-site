import { locales, type Locale } from './config';

/**
 * Textes des écrans système : 404, erreur, chargement.
 *
 * Ils vivent ici et non dans messages/*.json pour une raison technique :
 * ces écrans sont rendus par des composants client (error.tsx est
 * obligatoirement client, et not-found ne reçoit pas de params). Importer
 * un fichier JSON complet dans le bundle client pour six phrases serait
 * disproportionné. Le reste du site continue d'utiliser messages/*.json.
 */
export const systemMessages = {
  fr: {
    notFoundTitle: 'Cette page n’existe pas',
    notFoundText:
      'Le lien est peut-être erroné, ou la page a été déplacée. Reprenons depuis l’accueil.',
    backHome: 'Retour à l’accueil',
    errorTitle: 'Quelque chose s’est mal passé',
    errorText:
      'Une erreur inattendue est survenue de notre côté. Réessayez — si cela persiste, écrivez-nous, on corrige.',
    retry: 'Réessayer',
    contact: 'Nous écrire',
    loading: 'Chargement…',
  },
  ar: {
    notFoundTitle: 'هذه الصفحة غير موجودة',
    notFoundText:
      'قد يكون الرابط خاطئًا، أو أن الصفحة نُقلت. لنبدأ من الصفحة الرئيسية.',
    backHome: 'العودة إلى الرئيسية',
    errorTitle: 'حدث خطأ ما',
    errorText:
      'وقع خطأ غير متوقّع من جهتنا. أعد المحاولة — وإن تكرّر الأمر، راسلنا وسنصلحه.',
    retry: 'إعادة المحاولة',
    contact: 'راسلنا',
    loading: 'جارٍ التحميل…',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type SystemMessages = (typeof systemMessages)['fr'];

/**
 * Déduit la langue du premier segment du chemin.
 * Utilisé par les écrans système, qui ne reçoivent pas de params.
 */
export function localeFromPathname(pathname: string | null): Locale {
  const segment = pathname?.split('/')[1];
  return locales.includes(segment as Locale) ? (segment as Locale) : 'ar';
}
