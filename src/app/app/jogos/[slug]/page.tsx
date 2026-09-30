import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessFeature } from "@/lib/plans";
import { GAMES, parseAvatar, parseMergeBoard, encodeMergeBoard } from "@/lib/games";
import {
  StaticClassificar,
  StaticDadoSensorial,
  StaticDesafio,
  StaticMemoria,
  StaticMercado,
  StaticMergeGame,
  StaticPickTwo,
  StaticTapGroup,
} from "@/components/games-static";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function JogoPage({ params, searchParams }: Props) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  if (!canAccessFeature(user.plan, user.planExpiresAt, "games")) {
    redirect("/app/planos");
  }

  const { slug } = await params;
  const sp = await searchParams;
  const game = GAMES.find((g) => g.slug === slug);
  if (!game) {
    return (
      <div className="card space-y-3 p-5">
        <p>Jogo não encontrado.</p>
        <a href="/app/jogos" className="btn btn-primary">
          Voltar
        </a>
      </div>
    );
  }

  const children = await prisma.child.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  const child = children.find((c) => c.id === sp.child) || children[0] || null;

  if (!child) {
    return (
      <div className="card space-y-3 p-5">
        <p className="text-sm text-[var(--muted)]">
          Cadastre a criança e monte o boneco antes de jogar.
        </p>
        <a href="/app/criancas" className="btn btn-primary">
          Criar perfil
        </a>
      </div>
    );
  }

  const avatar = parseAvatar(child.avatar);
  const common = {
    childId: child.id,
    childName: child.name,
    avatar,
  };

  switch (slug) {
    case "dado-sensorial": {
      if (sp.roll === "1" && sp.food) {
        const face = String(Math.floor(Math.random() * 6));
        redirect(
          `/app/jogos/dado-sensorial?child=${child.id}&food=${encodeURIComponent(sp.food)}&face=${face}`
        );
      }
      return (
        <StaticDadoSensorial {...common} foodId={sp.food} faceIdx={sp.face} />
      );
    }
    case "classificar-grupos":
      return (
        <StaticClassificar
          {...common}
          food={sp.food}
          group={sp.group}
          score={sp.score}
        />
      );
    case "memoria-alimentos":
      return <StaticMemoria {...common} open={sp.open} />;
    case "prato-colorido":
      return (
        <StaticTapGroup
          {...common}
          slug={slug}
          title="Prato colorido"
          emoji="🎨"
          targetGroup="frutas"
          prompt="Toque nas FRUTAS coloridas!"
          pick={sp.pick}
          score={sp.score}
        />
      );
    case "caca-frutas":
      return (
        <StaticTapGroup
          {...common}
          slug={slug}
          title="Caça às Frutas"
          emoji="🍎"
          targetGroup="frutas"
          prompt="Toque só nas FRUTAS!"
          pick={sp.pick}
          score={sp.score}
        />
      );
    case "feijao-pula":
      return (
        <StaticPickTwo
          {...common}
          slug={slug}
          title="Feijão pula"
          emoji="🫘"
          aGroup="feijao"
          bGroup="arroz"
          aLabel="Feijão"
          bLabel="Arroz"
          pick={sp.pick}
        />
      );
    case "suco-magico":
      return (
        <StaticTapGroup
          {...common}
          slug={slug}
          title="Suco mágico"
          emoji="🧃"
          targetGroup="sucos"
          prompt="Ache os SUCOS!"
          pick={sp.pick}
          score={sp.score}
        />
      );
    case "arroz-feijao":
      return (
        <StaticPickTwo
          {...common}
          slug={slug}
          title="Arroz e feijão"
          emoji="🍚"
          aGroup="arroz"
          bGroup="feijao"
          aLabel="Arroz"
          bLabel="Feijão"
          pick={sp.pick}
        />
      );
    case "verdura-esconde":
      return (
        <StaticTapGroup
          {...common}
          slug={slug}
          title="Verdura Esconde"
          emoji="🥬"
          targetGroup="verduras"
          prompt="Ache as VERDURAS!"
          pick={sp.pick}
          score={sp.score}
        />
      );
    case "carnes-forte":
      return (
        <StaticTapGroup
          {...common}
          slug={slug}
          title="Carnes Fortes"
          emoji="🥩"
          targetGroup="carnes"
          prompt="Escolha CARNES!"
          pick={sp.pick}
          score={sp.score}
        />
      );
    case "mercado-magico":
      return <StaticMercado {...common} cart={sp.cart} />;
    case "desafio-rapido":
      return <StaticDesafio {...common} n={sp.n} />;
    case "pizza-grupos":
      return (
        <StaticMercado {...common} cart={sp.cart} />
      );
    case "sorvete-fruta":
      return (
        <StaticTapGroup
          {...common}
          slug={slug}
          title="Sorvete de Fruta"
          emoji="🍦"
          targetGroup="frutas"
          prompt="Toque nas FRUTAS do sorvete!"
          pick={sp.pick}
          score={sp.score}
        />
      );
    case "sopa-quente":
      return (
        <StaticTapGroup
          {...common}
          slug={slug}
          title="Sopa Quente"
          emoji="🍲"
          targetGroup="verduras"
          prompt="Ache VERDURAS para a sopa!"
          pick={sp.pick}
          score={sp.score}
        />
      );
    case "lancheira":
      return (
        <StaticPickTwo
          {...common}
          slug={slug}
          title="Lancheira da Escola"
          emoji="🎒"
          aGroup="frutas"
          bGroup="sucos"
          aLabel="Fruta"
          bLabel="Suco"
          pick={sp.pick}
        />
      );
    case "arco-iris":
      return (
        <StaticTapGroup
          {...common}
          slug={slug}
          title="Arco-íris no Prato"
          emoji="🌈"
          targetGroup="frutas"
          prompt="Toque as FRUTAS coloridas!"
          pick={sp.pick}
          score={sp.score}
        />
      );
    case "merge-alimentos": {
      let board =
        sp.g === "reset" || !sp.g ? parseMergeBoard(undefined) : parseMergeBoard(sp.g);
      let score = Math.max(0, Number(sp.score) || 0);
      let message = "";
      let sel: number | null =
        sp.sel !== undefined && sp.sel !== "" ? Number(sp.sel) : null;

      // Novo alimento (semente) em célula vazia
      if (sp.drop === "1") {
        const empties = board
          .map((v, i) => (v === 0 ? i : -1))
          .filter((i) => i >= 0);
        if (empties.length) {
          const pick = empties[Math.floor(Math.random() * empties.length)];
          board = [...board];
          board[pick] = 1;
          message = "Nova semente plantada! 🌱";
        } else {
          message = "Tabuleiro cheio — funda dois iguais para liberar espaço.";
        }
        redirect(
          `/app/jogos/merge-alimentos?child=${child.id}&g=${encodeMergeBoard(board)}&score=${score}`
        );
      }

      // Fusão a + b
      if (sp.a !== undefined && sp.b !== undefined) {
        const a = Number(sp.a);
        const b = Number(sp.b);
        if (
          Number.isInteger(a) &&
          Number.isInteger(b) &&
          a >= 0 &&
          b >= 0 &&
          a < board.length &&
          b < board.length &&
          a !== b
        ) {
          board = [...board];
          if (board[a] > 0 && board[a] === board[b] && board[a] < 6) {
            const next = board[a] + 1;
            board[b] = next;
            board[a] = 0;
            score += next * 10;
            message =
              next >= 6
                ? "Estrela! Refeição completa ⭐"
                : `Fusão! Subiu para o nível ${next}`;
          } else if (board[a] === 6 && board[b] === 6) {
            message = "Já é estrela — plantem sementes novas!";
          } else {
            message = "Só funde dois blocos IGUAIS.";
          }
        }
        redirect(
          `/app/jogos/merge-alimentos?child=${child.id}&g=${encodeMergeBoard(board)}&score=${score}&msg=${encodeURIComponent(message)}`
        );
      }

      if (sp.g === "reset") {
        redirect(
          `/app/jogos/merge-alimentos?child=${child.id}&g=${encodeMergeBoard(parseMergeBoard(undefined))}&score=0`
        );
      }

      return (
        <StaticMergeGame
          {...common}
          board={board}
          sel={sel}
          score={score}
          message={sp.msg ? decodeURIComponent(sp.msg) : undefined}
        />
      );
    }
    default:
      return (
        <div className="card p-5">
          <a href="/app/jogos">Voltar</a>
        </div>
      );
  }
}
