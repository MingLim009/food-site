import { getSession } from "@/lib/auth";

type Props = { searchParams: Promise<{ ok?: string; error?: string }> };

export default async function SugestoesPage({ searchParams }: Props) {
  const session = await getSession();
  const sp = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-3xl font-bold">Sugestões de melhoria</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Caixinha aberta para ideias: o que facilitar no app, o que falta, o que confundiu.
          Disponível em todos os planos.
        </p>
      </div>

      {sp.ok ? (
        <p className="rounded-xl bg-[var(--brand-soft)] px-3 py-2 text-sm font-semibold text-[var(--brand)]">
          Obrigada! Sua sugestão foi registada.
        </p>
      ) : null}
      {sp.error ? (
        <p className="rounded-xl bg-[#fde8e8] px-3 py-2 text-sm text-[var(--danger)]">
          Não foi possível enviar. Escreva pelo menos algumas palavras.
        </p>
      ) : null}

      <form action="/api/sugestoes" method="post" className="card space-y-3 p-4">
        <label className="block text-sm font-semibold">
          Seu nome (opcional)
          <input
            name="name"
            className="input mt-1"
            defaultValue={session?.name || ""}
            placeholder="Como prefere ser chamada"
          />
        </label>
        <label className="block text-sm font-semibold">
          E-mail (opcional)
          <input
            name="email"
            type="email"
            className="input mt-1"
            defaultValue={session?.email || ""}
          />
        </label>
        <label className="block text-sm font-semibold">
          Sua sugestão
          <textarea
            name="message"
            required
            minLength={5}
            rows={5}
            className="input mt-1"
            placeholder="Ex.: quero filtro na Escada por textura…"
          />
        </label>
        <button type="submit" className="btn btn-primary w-full">
          Enviar sugestão
        </button>
      </form>
    </div>
  );
}
