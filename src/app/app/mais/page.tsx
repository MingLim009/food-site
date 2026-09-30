import { MoreLinks } from "@/components/nav";

export default function MorePage() {
  return (
    <div className="space-y-5">
      <h1 className="display text-3xl font-bold">Mais recursos</h1>
      <p className="text-sm text-[var(--muted)]">
        Agenda, direitos e leis, medicações educativas, funções executivas, sugestões,
        receitas/ebooks (Gold), encadeamento (Gold), área profissional e planos.
      </p>
      <MoreLinks />
    </div>
  );
}
