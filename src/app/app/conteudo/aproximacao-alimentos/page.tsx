import Link from "next/link";

const IDEIAS = [
  {
    src: "/aproximacao/01.jpg",
    title: "Técnicas pra fazer crianças seletivas aceitarem novos alimentos",
    note: "Capa — o lúdico como ponte antes de provar.",
  },
  {
    src: "/aproximacao/02.jpg",
    title: "Língua de dinossauro com folhas verdes",
    note: "Pedir que a criança faça uma “língua de dinossauro” com alface ou outras folhas.",
  },
  {
    src: "/aproximacao/03.jpg",
    title: "Escova de cenoura",
    note: "Escovar os dentes com uma “escova” de cenoura — aproximação pela brincadeira.",
  },
  {
    src: "/aproximacao/04.jpg",
    title: "Flauta de pepino",
    note: "“Tocar flauta” com o pepino — cheiro, toque e presença no prato sem pressão.",
  },
  {
    src: "/aproximacao/05.jpg",
    title: "Língua rosa de beterraba",
    note: "Pintar a língua de beterraba e deixar “tudo rosa”.",
  },
  {
    src: "/aproximacao/06.jpg",
    title: "Bigode de carne",
    note: "Fazer “bigode” de carne — explorar textura e cheiro brincando.",
  },
  {
    src: "/aproximacao/07.jpg",
    title: "Pintar a boca com feijão",
    note: "“Pintar a boca” com o feijão — tocar e sentir antes de mastigar.",
  },
] as const;

export default function AproximacaoAlimentosPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand)]">
          Conteúdo educativo
        </p>
        <h1 className="display mt-1 text-3xl font-bold sm:text-4xl">
          Ideias para aproximação de alimentos
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Brincadeiras sensoriais para aproximar a criança do alimento sem forçar a ingestão —
          olhar, tocar, cheirar e brincar também contam. Inspirado no carrossel de @andreac.lins ·
          EloAlimentar / TIA Nutri.
        </p>
      </div>

      <section className="card space-y-2 p-5 text-sm leading-relaxed">
        <h2 className="text-lg font-bold">Como usar</h2>
        <p>
          Cada ideia é um convite leve. Celebre a etapa de hoje (tolerar no prato, tocar, cheirar)
          — não só “comer tudo”. Combine com a{" "}
          <Link href="/app/escada" className="font-semibold text-[var(--brand)] underline">
            Escada do Comer
          </Link>
          .
        </p>
      </section>

      <div className="grid gap-5">
        {IDEIAS.map((item, i) => (
          <article key={item.src} className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
            <div className="relative bg-[var(--brand-soft)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.title}
                className="mx-auto w-full max-w-lg object-contain"
                loading={i < 2 ? "eager" : "lazy"}
              />
            </div>
            <div className="space-y-1 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand)]">
                Ideia {i + 1}
              </p>
              <h2 className="text-base font-bold leading-snug sm:text-lg">{item.title}</h2>
              <p className="text-sm text-[var(--muted)]">{item.note}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-[var(--tea-gold)] bg-[var(--tea-gold-soft)] p-5 text-sm">
        <p className="font-bold text-[#9a6b0a]">Lembrete</p>
        <p className="mt-1 text-[var(--muted)]">
          Aproximação não é obrigação de engolir. Se houver dor, engasgo ou angústia intensa, busque
          acompanhamento multiprofissional (nutri, TO, fono). Este material é educativo e não
          substitui consulta.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/escada" className="btn btn-primary">
          Ir para Escada do Comer
        </Link>
        <Link href="/app/chat" className="btn btn-ghost">
          Perguntar à TIA Nutri
        </Link>
        <Link href="/app/mais" className="btn btn-ghost">
          Voltar ao Mais
        </Link>
      </div>
    </div>
  );
}
