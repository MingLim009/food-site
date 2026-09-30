import Link from "next/link";

export default function NutritionBehaviorPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand)]">
          Conteúdo educativo
        </p>
        <h1 className="display mt-1 text-3xl font-bold sm:text-4xl">
          Como a nutrição pode influenciar o comportamento no TEA e no TDAH
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Texto de apoio às famílias — não é diagnóstico, não indica doses nem substitui consulta.
          Andreza Dias · CRN 10418 · EloAlimentar / TIA Nutri.
        </p>
      </div>

      <section className="card space-y-3 p-5">
        <h2 className="text-lg font-bold">Ideia central</h2>
        <p className="text-sm leading-relaxed">
          Alimentação, sono, rotina sensorial e sistema nervoso conversam o tempo todo. Em crianças
          com TEA e/ou TDAH, padrões alimentares muito restritos, refeições caóticas ou desconforto
          gastrointestinal podem <strong>acompanhar</strong> mais irritabilidade, dificuldade de
          atenção, ansiedade à mesa ou desorganização — sem que a comida seja a “única causa” do
          comportamento.
        </p>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-lg font-bold">TEA — o que costuma aparecer</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>Hipersensibilidade a textura, cheiro, cor e temperatura → recusa e estresse.</li>
          <li>Necessidade de previsibilidade → mudanças no prato podem gerar crise comportamental.</li>
          <li>Padrões rígidos de marca/formato → menos variedade nutricional ao longo do tempo.</li>
          <li>
            Se houver dor, constipação ou desconforto digestivo, o comportamento à mesa e fora dela
            pode piorar — isso pede avaliação clínica, não “forçar a comer”.
          </li>
        </ul>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-lg font-bold">TDAH — o que costuma aparecer</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>Funções executivas da alimentação: iniciar, permanecer, terminar a refeição.</li>
          <li>Busca por estímulos intensos (sabores fortes, crocância) ou distração fácil à mesa.</li>
          <li>Pulos de refeição / fome irregular → oscilação de humor e energia.</li>
          <li>
            Alguns medicamentos alteram apetite; qualquer mudança deve ser conversada com o médico
            prescritor — a TIA Nutri não ajusta medicação.
          </li>
        </ul>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-lg font-bold">Nutrientes em dietas muito restritas (educativo)</h2>
        <p className="text-sm leading-relaxed">
          Quando o cardápio é muito curto, pode haver risco de inadequação de ferro, zinco, cálcio,
          vitamina D, complexo B, ômega-3 e proteína de qualidade — entre outros. Isso{" "}
          <strong>pode</strong> se relacionar a cansaço, irritabilidade ou menor disposição, mas só
          exame e conduta profissional confirmam. A plataforma <strong>não informa doses</strong> nem
          protocolos de suplementação.
        </p>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-lg font-bold">O que ajuda na prática (sem pressão)</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          <li>Usar a Escada do Comer: celebrar olhar, cheirar e tocar — não só “comer tudo”.</li>
          <li>Manter um alimento seguro sempre presente no prato.</li>
          <li>Ambiente mais calmo, porções visuais claras, avisos curtos antes da refeição.</li>
          <li>Rotina previsível de horários (ajuda TDAH e TEA).</li>
          <li>Receitas em desenho e ebooks sensoriais para ensaiar o preparo com leveza.</li>
          <li>Rede: nutricionista; TO se TPS; fono se oral-motor; médico se sintomas sistêmicos.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-[var(--tea-gold)] bg-[var(--tea-gold-soft)] p-5 text-sm">
        <p className="font-bold text-[#9a6b0a]">Limite importante</p>
        <p className="mt-1 text-[var(--muted)]">
          Nutrição pode influenciar disposição e comportamento, mas TEA e TDAH são condições
          complexas. Este texto não diagnostica, não trata e não substitui acompanhamento
          multiprofissional.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/escada" className="btn btn-primary">
          Ir para Escada do Comer
        </Link>
        <Link href="/app/receitas" className="btn btn-ghost">
          Ver receitas em desenho
        </Link>
        <Link href="/app/chat" className="btn btn-ghost">
          Perguntar à TIA Nutri
        </Link>
      </div>
    </div>
  );
}
