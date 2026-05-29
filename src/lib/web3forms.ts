const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "";

export type Web3FormType = "speak_up" | "appointment" | "contact" | "join_team";

const SUBJECTS: Record<Web3FormType, string> = {
  speak_up: "CFBUF — New Speak Up Submission",
  appointment: "CFBUF — New Meeting Request",
  contact: "CFBUF — Contact Form",
  join_team: "CFBUF — Join Team Application",
};

export async function submitWeb3Form(
  type: Web3FormType,
  data: Record<string, string>
): Promise<void> {
  if (!ACCESS_KEY || ACCESS_KEY === "your_access_key_here") {
    console.warn("Web3Forms access key not configured — email not sent.");
    return;
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: SUBJECTS[type],
      from_name: "CFBUF Website",
      ...data,
    }),
  });

  const json = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!response.ok || !json.success) {
    throw new Error(json.message ?? "Failed to send email notification");
  }
}

export function isWeb3FormsConfigured(): boolean {
  return Boolean(ACCESS_KEY && ACCESS_KEY !== "your_access_key_here");
}
