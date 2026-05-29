import { addFormSubmission } from "@/lib/cms-store";
import type { FormSubmissionType } from "@/lib/cms-types";
import { submitWeb3Form, type Web3FormType } from "@/lib/web3forms";

const TYPE_MAP: Record<FormSubmissionType, Web3FormType> = {
  speak_up: "speak_up",
  appointment: "appointment",
};

export async function submitPublicForm(
  type: FormSubmissionType,
  data: Record<string, string>
): Promise<void> {
  await addFormSubmission(type, data);
  try {
    await submitWeb3Form(TYPE_MAP[type], data);
  } catch (err) {
    console.warn("Web3Forms email failed; submission saved in Supabase.", err);
  }
}
