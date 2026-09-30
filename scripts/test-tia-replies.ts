import { generateAssistantReply } from "../src/lib/rag";

const child = `PERFIL DA CRIANÇA (único contexto permitido):
Nome: Lucas
Texturas preferidas: crocante, seco
Cores preferidas: bege, laranja
Formas preferidas: palito, círculo
Alimentos aceitos: biscoito, batata frita, iogurte liso
Alimentos recusados: folhas, misturas, alimentos úmidos pegajosos
Notas: Melhor desempenho em ambiente calmo.`;

async function ask(q: string) {
  const reply = await generateAssistantReply({
    userMessage: q,
    childContext: child,
    history: [],
  });
  console.log("\nQ:", q);
  console.log("A:", reply.slice(0, 320).replace(/\n/g, " | "));
  return reply;
}

async function main() {
  const a = await ask("Meu filho não come feijão, o que faço?");
  const b = await ask("Como usar a Escada do Comer com batata-doce?");
  const c = await ask("Ele foge da mesa o tempo todo, é TDAH?");
  const same =
    a.slice(0, 80) === b.slice(0, 80) || b.slice(0, 80) === c.slice(0, 80);
  console.log("\nSame opening across answers?", same);
  console.log("Lengths", a.length, b.length, c.length);
}

main();
