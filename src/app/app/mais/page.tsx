import { MoreLinks } from "@/components/nav";

export default function MorePage() {
  return (
    <div className="space-y-5">
      <h1 className="display text-3xl font-bold">
        Mais recursos
      </h1>
      <p className="text-sm text-[var(--muted)]">
        Receitas, encadeamento, questionário e planos — conforme seu acesso.
      </p>
      <MoreLinks />
    </div>
  );
}
