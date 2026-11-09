/**
 * Keep English as the default while recognizing clear Spanish messages for
 * the bilingual fallback and action templates.
 */
export function isSpanishMessage(message) {
  const normalized = String(message ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  const strongSpanishSignals = /\b(?:servidor|gracias|agradezco|pago|factura|reembolso|podrian|podemos|quiero|necesito|funciona|fallo|caido|base de datos|por favor|no podemos acceder)\b/
  if (strongSpanishSignals.test(normalized)) return true

  const spanishGrammarCues = normalized.match(/\b(?:el|la|los|las|un|una|que|por|para|mi|mis|su|sus|cuando|donde|como)\b/g) || []
  return spanishGrammarCues.length >= 2
}
