/**
 * Recommendation Templates - Maps categories to recommended actions
 */
import { isSpanishMessage } from './language.js'

const actionTemplates = {
  "Billing Issue": "Review the affected invoice or payment and confirm the account status.",
  "Technical Problem": "Reproduce the issue, check service status, and route it to technical support.",
  "General Inquiry": "Answer the question with the relevant help-center information.",
  "Feature Request": "Record the requested improvement with its use case for product review.",
  "Human Review": "Route the message to a support agent for manual review.",
  "Unknown": "Review the message manually and assign the right support category."
}

const spanishActionTemplates = {
  "Billing Issue": "Revisa la factura o el pago afectado y confirma el estado de la cuenta.",
  "Technical Problem": "Reproduce el problema, revisa el estado del servicio y asígnalo al equipo técnico.",
  "General Inquiry": "Responde con la información pertinente del centro de ayuda.",
  "Feature Request": "Registra la mejora solicitada y su caso de uso para que el equipo de producto la revise.",
  "Human Review": "Asigna el mensaje a un agente de soporte para que lo revise manualmente.",
  "Unknown": "Revisa el mensaje manualmente y asígnale la categoría de soporte adecuada."
}

/**
 * Get recommended action for a given category
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @returns {string} - Recommended next step
 */
export function getRecommendedAction(category, urgency = "Low", message = "") {
  const isSpanish = isSpanishMessage(message)
  const templates = isSpanish ? spanishActionTemplates : actionTemplates
  const action = templates[category] || templates.Unknown
  if (urgency === "High") {
    return isSpanish
      ? `Escala el caso de inmediato al responsable de soporte de guardia. ${action}`
      : `Escalate to the on-call support lead immediately. ${action}`
  }
  return action
}

/**
 * Get all available categories
 * 
 * @returns {string[]} - List of categories
 */
export function getAvailableCategories() {
  return Object.keys(actionTemplates)
}

/**
 * Determines if message should be escalated
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @param {string} message - The original message
 * @returns {boolean} - Whether to escalate
 */
export function shouldEscalate(category, urgency, message) {
  return urgency === "High" || category === "Human Review" || category === "Unknown" || /\b(?:security breach|account compromised|data loss)\b/i.test(message)
}
