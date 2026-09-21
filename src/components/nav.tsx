"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  BookOpen,
  Home,
  MessageCircle,
  ListOrdered,
  ClipboardList,
  Link2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/app", label: "Início", icon: Home },
  { href: "/app/chat", label: "TIA", icon: MessageCircle },
  { href: "/app/criancas", label: "Perfis", icon: Baby },
  { href: "/app/escada", label: "Escada", icon: ListOrdered },
  { href: "/app/mais", label: "Mais", icon: BookOpen },
];

export function BottomNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[color-mix(in_oklab,var(--nav)_94%,transparent)] shadow-[0_-12px_32px_rgba(10,20,18,0.35)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/app" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-bold transition-colors",
                active
                  ? "bg-white/12 text-[var(--brand)]"
                  : "text-[var(--muted)]"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
      {isAdmin ? (
        <div className="absolute -top-10 right-3">
          <Link href="/admin" className="chip inline-flex gap-1">
            <Shield size={12} /> Admin
          </Link>
        </div>
      ) : null}
    </nav>
  );
}

export function MoreLinks() {
  const links = [
    { href: "/app/receitas", label: "Receitas sensoriais", icon: BookOpen },
    { href: "/app/encadeamento", label: "Encadeamento alimentar", icon: Link2 },
    { href: "/app/questionario", label: "Questionário", icon: ClipboardList },
    { href: "/app/planos", label: "Planos e acesso", icon: ListOrdered },
    { href: "/privacidade", label: "LGPD / Privacidade", icon: Shield },
  ];
  return (
    <div className="space-y-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className="card flex items-center gap-3 p-4">
          <span className="rounded-xl bg-[var(--brand-soft)] p-2 text-[var(--brand)]">
            <Icon size={18} />
          </span>
          <span className="font-bold">{label}</span>
        </Link>
      ))}
    </div>
  );
}
