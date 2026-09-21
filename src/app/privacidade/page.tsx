import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/" className="text-sm font-bold text-[var(--brand)]">
        ← Voltar
      </Link>
      <h1 className="display mt-4 text-3xl font-bold">
        Privacidade e LGPD
      </h1>
      <div className="card mt-6 space-y-4 p-5 text-sm leading-relaxed text-[var(--muted)]">
        <p>
          A EloAlimentar trata dados pessoais de responsáveis legais e dados de crianças
          sob base legal de execução de contrato e consentimento, com finalidade de
          prestar apoio educativo sobre seletividade alimentar.
        </p>
        <p>
          Dados coletados incluem identificação do responsável, perfil da criança
          (preferências alimentares/sensoriais, medidas antropométricas opcionais),
          histórico de interações com a TIA Nutri e resultados de questionários.
        </p>
        <p>
          Medidas: autenticação, isolamento por usuário (a TIA Nutri não responde sobre outra
          criança), controle de acesso por plano e área administrativa restrita.
        </p>
        <p>
          Direitos do titular: acesso, correção, exclusão, portabilidade e revogação do
          consentimento — solicitáveis pelo canal de suporte da plataforma.
        </p>
        <p>
          A TIA Nutri não diagnostica, não prescreve e não informa doses de vitaminas/minerais.
          Em dúvidas clínicas, procure profissionais habilitados.
        </p>
      </div>
    </main>
  );
}
