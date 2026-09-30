import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProUser } from "@/components/pro-area";
import { getProDoc } from "@/lib/professional";

type Props = { params: Promise<{ slug: string }> };

export default async function ProDocPage({ params }: Props) {
  await requireProUser();
  const { slug } = await params;
  const doc = getProDoc(slug);
  if (!doc) notFound();

  return (
    <div className="space-y-5">
      <Link href="/app/profissional" className="text-sm font-bold text-[var(--brand)]">
        ← Área profissional
      </Link>
      <div>
        <p className="chip w-fit capitalize">{doc.category}</p>
        <h1 className="display mt-2 text-3xl font-bold">{doc.title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{doc.summary}</p>
      </div>
      {doc.printable ? (
        <a href={`/api/profissional/download/${doc.slug}`} className="btn btn-primary w-full">
          Baixar para imprimir
        </a>
      ) : null}
      <article className="card p-4">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">
          {doc.body}
        </pre>
      </article>
    </div>
  );
}
