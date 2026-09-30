import { requireProUser } from "@/components/pro-area";
import { ProAiClient } from "./pro-ai-client";

export default async function Page() {
  await requireProUser();
  return <ProAiClient />;
}
