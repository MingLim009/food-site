import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAppMode } from "@/lib/app-mode";
import { canAccessFeature } from "@/lib/plans";
import { proDocsByCategory, type ProDoc } from "@/lib/professional";

export async function requireProUser() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }
  if (!canAccessFeature(user.plan, user.planExpiresAt, "professional")) {
    redirect("/app/profissional");
  }
  const mode = await getAppMode();
  if (mode !== "pro") {
    redirect("/app/profissional");
  }
  return user;
}

export function ProDocCard({ doc }: { doc: ProDoc }) {
  return (
    <article className="card space-y-3 p-4">
      <h2 className="font-bold">{doc.title}</h2>
      <p className="text-sm text-[var(--muted)]">{doc.summary}</p>
      <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[var(--bg-soft)] p-3 text-xs leading-relaxed text-[var(--ink)]">
        {doc.body}
      </pre>
      <div className="flex flex-wrap gap-2">
        <Link href={`/app/profissional/doc/${doc.slug}`} className="btn btn-secondary text-sm">
          Abrir completo
        </Link>
        {doc.printable ? (
          <a
            href={`/api/profissional/download/${doc.slug}`}
            className="btn btn-primary text-sm"
          >
            Baixar / imprimir
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function ProCategoryView({
  title,
  intro,
  category,
}: {
  title: string;
  intro: string;
  category: ProDoc["category"];
}) {
  const docs = proDocsByCategory(category);
  return (
    <div className="space-y-5">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>
      <div>
        <h1 className="display text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{intro}</p>
      </div>
      <div className="space-y-4">
        {docs.map((d) => (
          <ProDocCard key={d.slug} doc={d} />
        ))}
      </div>
    </div>
  );
}
