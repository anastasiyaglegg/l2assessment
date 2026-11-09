/**
 * Estimate support urgency from customer impact and time-sensitive language.
 * Message length, punctuation, politeness, and the time of day are not reliable
 * measures of how much harm an unresolved issue is causing.
 */

const highImpactPatterns = [
  /\b(?:server|database|site|service|checkout|payment processing)\s+(?:is\s+)?(?:down|unavailable|offline)\b/,
  /\b(?:production|system[- ]wide|widespread)\b.*\b(?:down|outage|unavailable|failure|failing)\b/,
  /\b(?:down|outage|unavailable|failure|failing)\b.*\b(?:production|system|database|server|checkout|customers|users)\b/,
  /\b(?:database connection lost|server is down|site is down|service is down|complete outage)\b/,
  /\b(?:all|every)\s+(?:customers?|users?|accounts?)\b.{0,45}\b(?:affected|unable|cannot|can't|down|unavailable|blocked|locked out|failing|failed|broken)\b/,
  /\b(?:affected|unable|cannot|can't|down|unavailable|blocked|locked out|failing|failed|broken)\b.{0,45}\b(?:all|every)\s+(?:customers?|users?|accounts?)\b/,
  /\b(?:todos|todas)\s+(?:los|las)?\s*(?:clientes|usuarios|cuentas)\b.{0,45}\b(?:afectados|sin acceso|caidos|no disponibles|bloqueados|fallando|fallaron)\b/,
  /\b(?:data loss|security breach|account compromised|checkout unavailable)\b/,
  /\b(?:servidor|sistema|base de datos|sitio|servicio)\b.{0,40}\b(?:esta\s+)?(?:caido|inactivo|no responde|no disponible|fuera de servicio)\b/,
  /\b(?:no podemos acceder|no se puede acceder|no funciona)\b.{0,40}\b(?:servidor|sistema|base de datos|sitio|servicio)\b/,
  /\b(?:perdida de datos|brecha de seguridad|cuenta comprometida)\b/,
];

const explicitUrgencyPattern = /\b(?:urgent|emergency|critical incident|asap|urgente|emergencia)\b/;
const negatedUrgencyPattern = /\b(?:not urgent|isn't urgent|is not urgent|not an emergency|not critical|no es urgente|no esta urgente|no es una emergencia)\b/;

const activeIssuePatterns = [
  /\b(?:not working|doesn't work|does not work|broken|blocked|locked out|cannot|can't|unable to|failed|failure|error|bug|crash|slow\w*|loading|timed out|timing out|unable to check out|charged twice|duplicate charge)\b/,
  /\b(?:refund|payment failed|payment declined|billing issue|can't access|cannot access)\b/,
  /\b(?:no funciona|no puedo|no podemos|error|fallo|problema|lento\w*|no carga|no responde|pago rechazado|pago fallido|cobro duplicado|reembolso)\b/,
];

const lowUrgencyPatterns = [
  /\b(?:thank you|thanks|appreciate|love|great job|happy with|wonderful)\b/,
  /\b(?:feature request|would like to see|could you add|please add|suggestion|feedback)\b/,
];

/**
 * @param {string} message - Customer support message
 * @returns {"High"|"Medium"|"Low"}
 */
export function calculateUrgency(message) {
  const normalized = String(message ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ').trim();

  if (!normalized) return 'Low';

  // Explicitly described broad or safety-sensitive impact must win over
  // courtesy, message length, and other low urgency cues.
  if (highImpactPatterns.some((pattern) => pattern.test(normalized))) return 'High';
  if (explicitUrgencyPattern.test(normalized) && !negatedUrgencyPattern.test(normalized)) return 'High';
  if (activeIssuePatterns.some((pattern) => pattern.test(normalized))) return 'Medium';
  if (lowUrgencyPatterns.some((pattern) => pattern.test(normalized))) return 'Low';

  // Questions, requests for information, and uncategorized short messages do
  // not become urgent simply because of their length, punctuation, or timing.
  return 'Low';
}
