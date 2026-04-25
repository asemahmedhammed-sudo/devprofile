'use server';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * Handles contact form submissions.
 * In production: replace the simulated delay with your email provider
 * (e.g., Resend, SendGrid) or a database insert.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // ── Field presence validation ──
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return { status: "error", message: "Invalid form submission." };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || trimmedName.length < 2) {
    return { status: "error", message: "Please enter your full name." };
  }

  if (!validateEmail(trimmedEmail)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (!trimmedMessage || trimmedMessage.length < 10) {
    return { status: "error", message: "Message must be at least 10 characters." };
  }

  // ── Simulated network IO (replace with Resend / DB call) ──
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Production hook point:
  // await resend.emails.send({ from: "...", to: "asem@example.com", ... });

  return {
    status: "success",
    message: "Message received. I'll be in touch within 24 hours.",
  };
}
