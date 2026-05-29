// ─── Formspree Form Submission ───────────────────────────────────────────────
// Sign up at https://formspree.io and create a form for each endpoint below.
// Then add the form IDs to your .env.local file.

const ENDPOINTS = {
  issues:      `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ISSUES      ?? "YOUR_ISSUES_ID"}`,
  appointment: `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_APPOINTMENT ?? "YOUR_APPOINTMENT_ID"}`,
  joinTeam:    `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_JOIN_TEAM   ?? "YOUR_JOIN_TEAM_ID"}`,
  contact:     `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_CONTACT     ?? "YOUR_CONTACT_ID"}`,
} as const;

export type FormType = keyof typeof ENDPOINTS;

export async function submitForm(type: FormType, data: Record<string, unknown>): Promise<void> {
  const response = await fetch(ENDPOINTS[type], {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? "Form submission failed");
  }
}
