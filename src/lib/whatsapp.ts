/**
 * Builds a WhatsApp click-to-chat URL from a Saudi local or international number.
 *
 * Saudi mobile format: 05XXXXXXXX (10 digits locally) → +966 5XXXXXXXX (9 digits intl.)
 */
export function buildWhatsAppLink(rawNumber: string): {
  url: string;
  display: string;
  e164: string;
  isValid: boolean;
} {
  const digits = rawNumber.replace(/\D/g, "");

  let intl: string;
  if (digits.startsWith("966")) {
    intl = digits;
  } else if (digits.startsWith("0")) {
    intl = `966${digits.slice(1)}`;
  } else if (digits.startsWith("5")) {
    intl = `966${digits}`;
  } else {
    intl = `966${digits}`;
  }

  const display = intl.startsWith("966") ? `0${intl.slice(3)}` : rawNumber;
  const isValid = /^9665\d{8}$/.test(intl);

  return {
    url: `https://wa.me/${intl}`,
    display,
    e164: `+${intl}`,
    isValid,
  };
}

export function getWhatsAppConfig() {
  const raw = process.env.WHATSAPP_NUMBER ?? "0530004982";
  return buildWhatsAppLink(raw);
}
