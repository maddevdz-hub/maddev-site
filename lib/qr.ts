import QRCode from 'qrcode';

/**
 * Génère un QR code en SVG, côté serveur uniquement.
 *
 * Généré à la construction plutôt que déposé en fichier statique : le code
 * suit alors automatiquement l'URL. Un QR imprimé sur les tables d'un café
 * qui pointerait vers une ancienne adresse serait un défaut coûteux — on
 * refait les affiches, pas le site.
 *
 * Niveau de correction Q (25 %) : une carte de café finit tachée, pliée ou
 * partiellement cachée par un verre. Le niveau M, plus courant, laisse trop
 * peu de marge dans ces conditions.
 */
export async function qrSvg(
  url: string,
  { dark = '#2a1d16', light = '#ffffff' } = {},
): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'Q',
    margin: 1,
    color: { dark, light },
  });
}
