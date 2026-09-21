# EloAlimentar

Plataforma web mobile-first com a TIA Nutri (IA + RAG) para apoiar pais de crianças com seletividade alimentar, TEA e TDAH.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Prisma + SQLite
- Autenticação por cookie JWT (jose + bcryptjs)
- RAG local por similaridade lexical + OpenAI opcional (`OPENAI_API_KEY`)
- Guardrails clínicos (sem doses, sem diagnóstico, sem cruzar crianças)

## Funcionalidades

- Login / cadastro com aceite LGPD
- Planos: Básico (R$29,90 / 15 dias), Premium (R$99,90 / 3 meses), Gold (R$220 / 6 meses)
- Perfis detalhados por criança
- Chat com a TIA Nutri + histórico (escopo só da criança ativa)
- Escada do Comer (passos 1–26)
- Encadeamento alimentar e receitas sensoriais (Premium/Gold)
- Questionário de seletividade (investigação inicial)
- Admin: usuários + biblioteca de conteúdo RAG

## Como rodar

```bash
npm install
npx prisma db push
npm run seed
npm run dev
```

Abra http://localhost:3000

### Contas demo

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Mãe (Gold) | mae@demo.com | demo1234 |
| Admin | admin@eloalimentar.com | admin1234 |

## Variáveis de ambiente

Copie `.env.example` para `.env`:

- `DATABASE_URL` — SQLite
- `AUTH_SECRET` — segredo JWT
- `OPENAI_API_KEY` — opcional; sem ela a TIA Nutri usa resposta local baseada no RAG

## Observações de entrega (MVP 5 dias)

- Pagamento de planos é **simulado** (ativação imediata). Integre Mercado Pago/Stripe em produção.
- Conteúdo clínico seed é educativo; substitua pela biblioteca da nutricionista via Admin.
- Mobile-first; responsivo em tablet/desktop.
- Apps nativos Android/iOS ficam para fase futura.
