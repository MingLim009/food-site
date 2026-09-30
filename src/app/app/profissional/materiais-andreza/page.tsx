import { redirect } from "next/navigation";

/** Redireciona: PDFs anexados ficam em Recursos terapêuticos. */
export default function MateriaisAndrezaRedirect() {
  redirect("/app/profissional/recursos");
}
