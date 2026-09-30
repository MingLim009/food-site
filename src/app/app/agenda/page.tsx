import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessFeature } from "@/lib/plans";

type Props = { searchParams: Promise<{ ok?: string; error?: string }> };

export default async function AgendaPage({ searchParams }: Props) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "agenda")) {
    return (
      <div className="card space-y-3 p-5">
        <h1 className="display text-2xl font-bold">Agenda</h1>
        <p className="text-sm text-[var(--muted)]">
          Disponível nos planos Médio (Premium) e Gold.
        </p>
        <Link href="/app/planos" className="btn btn-primary">
          Ver planos
        </Link>
      </div>
    );
  }

  const sp = await searchParams;
  const children = await prisma.child.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  });
  const events = await prisma.agendaEvent.findMany({
    where: { userId: user.id },
    orderBy: { startsAt: "asc" },
    take: 40,
  });

  const now = Date.now();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-3xl font-bold">Agenda</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Consultas, terapias e lembretes de medicação. O alarme é um aviso na lista (minutos antes).
          Notificações do celular do sistema podem ser ligadas depois no app nativo.
        </p>
      </div>

      {sp.ok ? (
        <p className="rounded-xl bg-[var(--brand-soft)] px-3 py-2 text-sm font-semibold text-[var(--brand)]">
          Evento salvo.
        </p>
      ) : null}
      {sp.error ? (
        <p className="rounded-xl bg-[#fde8e8] px-3 py-2 text-sm text-[var(--danger)]">
          Não foi possível salvar. Confira data/hora e tente de novo.
        </p>
      ) : null}

      <form action="/api/agenda" method="post" className="card space-y-3 p-4">
        <h2 className="font-bold">Novo compromisso</h2>
        <label className="block text-sm font-semibold">
          Título
          <input name="title" required className="input mt-1" placeholder="Ex.: Fono — João" />
        </label>
        <label className="block text-sm font-semibold">
          Tipo
          <select name="kind" className="input mt-1">
            <option value="consulta">Consulta</option>
            <option value="terapia">Terapia</option>
            <option value="medicacao">Medicação</option>
            <option value="outro">Outro</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Data e hora
          <input name="startsAt" type="datetime-local" required className="input mt-1" />
        </label>
        <label className="block text-sm font-semibold">
          Alarme (minutos antes)
          <input name="alarmMin" type="number" min={0} max={1440} defaultValue={30} className="input mt-1" />
        </label>
        {children.length ? (
          <label className="block text-sm font-semibold">
            Criança (opcional)
            <select name="childId" className="input mt-1">
              <option value="">—</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="block text-sm font-semibold">
          Notas
          <textarea name="notes" rows={2} className="input mt-1" placeholder="Local, profissional…" />
        </label>
        <button type="submit" className="btn btn-primary w-full">
          Salvar na agenda
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="font-bold">Próximos</h2>
        {events.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nenhum evento ainda.</p>
        ) : (
          events.map((ev) => {
            const alarmAt = ev.startsAt.getTime() - ev.alarmMin * 60_000;
            const alarmSoon = now >= alarmAt && now <= ev.startsAt.getTime();
            return (
              <article
                key={ev.id}
                className={`card space-y-2 p-4 ${alarmSoon ? "ring-2 ring-[var(--accent)]" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="chip w-fit text-[10px] uppercase">{ev.kind}</p>
                    <h3 className="mt-1 font-bold">{ev.title}</h3>
                    <p className="text-sm text-[var(--muted)]">
                      {ev.startsAt.toLocaleString("pt-BR")}
                      {ev.alarmMin > 0 ? ` · alarme ${ev.alarmMin} min antes` : ""}
                    </p>
                    {alarmSoon ? (
                      <p className="mt-1 text-sm font-bold text-[var(--accent)]">⏰ Alarme ativo</p>
                    ) : null}
                    {ev.notes ? <p className="mt-1 text-sm">{ev.notes}</p> : null}
                  </div>
                  <form action="/api/agenda" method="post">
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={ev.id} />
                    <button type="submit" className="text-xs font-bold text-[var(--danger)]">
                      Excluir
                    </button>
                  </form>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
