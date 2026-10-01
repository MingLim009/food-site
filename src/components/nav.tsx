"use client";

import { usePathname } from "next/navigation";
import {
  Baby,
  BookOpen,
  Briefcase,
  Calendar,
  ClipboardList,
  Gamepad2,
  Home,
  Lightbulb,
  Link2,
  ListOrdered,
  MessageCircle,
  Pill,
  Scale,
  Shield,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/app", label: "Início", icon: Home },
  { href: "/app/chat", label: "TIA", icon: MessageCircle },
  { href: "/app/jogos", label: "Jogos", icon: Gamepad2 },
  { href: "/app/escada", label: "Escada", icon: ListOrdered },
  { href: "/app/mais", label: "Mais", icon: BookOpen },
];

export function BottomNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-2 pt-2 md:max-w-3xl lg:max-w-5xl">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/app" && pathname.startsWith(href));
          return (
            <a
              key={href}
              href={href}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[0.75rem] px-1 py-1.5 text-[11px] font-semibold transition-colors",
                active
                  ? "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              {label}
            </a>
          );
        })}
      </div>
      {isAdmin ? (
        <div className="absolute -top-10 right-3">
          <a href="/admin" className="chip inline-flex gap-1 shadow-sm">
            <Shield size={12} /> Admin
          </a>
        </div>
      ) : null}
    </nav>
  );
}

export function MoreLinks() {
  const links = [
    { href: "/app/novelinha", label: "Novelinha 2D (10 episódios)", icon: BookOpen },
    { href: "/app/juridico", label: "Direitos e leis (escola / TEA / TDAH)", icon: Scale },
    { href: "/app/pecs", label: "Cartões PECs / CAA (família)", icon: Baby },
    { href: "/app/agenda", label: "Agenda e alarmes", icon: Calendar },
    { href: "/app/medicacoes", label: "Medicações TEA/TDAH (educativo)", icon: Pill },
    { href: "/app/funcoes-executivas", label: "Funções executivas", icon: Brain },
    { href: "/app/sugestoes", label: "Sugestões de melhoria", icon: Lightbulb },
    { href: "/app/profissional", label: "Área profissional (Gold)", icon: Briefcase },
    { href: "/app/jogos", label: "Jogos interativos", icon: Gamepad2 },
    { href: "/app/criancas", label: "Perfis e boneco da criança", icon: Baby },
    { href: "/app/receitas", label: "Receitas, vídeos e ebooks (Gold)", icon: BookOpen },
    {
      href: "/app/conteudo/aproximacao-alimentos",
      label: "Ideias para aproximação de alimentos",
      icon: Lightbulb,
    },
    {
      href: "/app/conteudo/nutricao-comportamento",
      label: "Nutrição e comportamento (TEA/TDAH)",
      icon: BookOpen,
    },
    { href: "/app/encadeamento", label: "Encadeamento alimentar (Gold)", icon: Link2 },
    { href: "/app/questionario", label: "Questionário de seletividade", icon: ClipboardList },
    { href: "/app/planos", label: "Planos e acesso", icon: ListOrdered },
    { href: "/privacidade", label: "LGPD / Privacidade", icon: Shield },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className="card flex min-h-14 items-center gap-3 p-4 transition hover:border-[var(--brand)]"
        >
          <span className="rounded-[0.65rem] bg-[var(--brand-soft)] p-2.5 text-[var(--brand)]">
            <Icon size={18} />
          </span>
          <span className="font-bold leading-snug">{label}</span>
        </a>
      ))}
    </div>
  );
}
