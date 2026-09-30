const fs = require("fs");

async function main() {
  const login = await fetch("http://127.0.0.1:3000/api/auth/login-form", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "email=mae@demo.com&password=demo1234",
    redirect: "manual",
  });
  const cookies = (login.headers.getSetCookie?.() || []).map((c) => c.split(";")[0]).join("; ");
  const setCookie = login.headers.get("set-cookie") || "";
  const cookie = cookies || setCookie.split(",").map((c) => c.split(";")[0].trim()).filter((c) => c.includes("=")).join("; ");
  console.log("login", login.status, "cookieLen", cookie.length);

  for (const path of ["/app/receitas", "/app/jogos", "/app/chat"]) {
    const res = await fetch("http://127.0.0.1:3000" + path, {
      headers: { Cookie: cookie },
      redirect: "manual",
    });
    const html = await res.text();
    fs.writeFileSync("tmp-" + path.replace(/\//g, "_") + ".html", html);
    console.log(path, res.status, "len", html.length);
    if (path.includes("receitas")) {
      console.log("  assistir", (html.match(/Assistir desenho/g) || []).length);
      console.log("  recipe links", (html.match(/\/app\/receitas\?r=/g) || []).length);
      console.log("  has bolo", html.includes("Bolo de banana"));
    }
    if (path.includes("jogos")) {
      console.log("  dado", html.includes("dado-sensorial"));
      console.log("  play", html.includes("Toque para jogar"));
    }
    if (path.includes("chat")) {
      console.log("  form ask", html.includes("/api/chat/ask"));
      console.log("  suggestions", (html.match(/action="\/api\/chat\/ask"/g) || []).length);
    }
  }

  // Recipe change: pick second recipe id from first page
  const receitas = fs.readFileSync("tmp-_app_receitas.html", "utf8");
  const ids = [...receitas.matchAll(/\/app\/receitas\?r=([^&"]+)/g)].map((m) => m[1]);
  console.log("unique recipe ids sample", [...new Set(ids)].slice(0, 3));
  if (ids[1]) {
    const r2 = await fetch("http://127.0.0.1:3000/app/receitas?r=" + ids[1], {
      headers: { Cookie: cookie },
    });
    const h2 = await r2.text();
    const titleMatch = h2.match(/<h2 class="text-xl[^"]*"[^>]*>([^<]+)<\/h2>/);
    console.log("switched recipe title", titleMatch?.[1]);
    const play = await fetch(
      "http://127.0.0.1:3000/app/receitas?r=" + ids[1] + "&play=1",
      { headers: { Cookie: cookie } }
    );
    const hp = await play.text();
    console.log("playAll cenas", (hp.match(/id="cena-/g) || []).length);
  }

  // Game roll
  const childMatch = receitas.match(/child=([a-z0-9]+)/) || fs.readFileSync("tmp-_app_jogos.html", "utf8").match(/child=([a-z0-9]+)/);
  const child = [...fs.readFileSync("tmp-_app_jogos.html", "utf8").matchAll(/child=([a-z0-9]+)/g)][0]?.[1];
  console.log("child", child);
  if (child) {
    const g = await fetch(
      `http://127.0.0.1:3000/app/jogos/dado-sensorial?child=${child}&food=banana&roll=1`,
      { headers: { Cookie: cookie }, redirect: "manual" }
    );
    console.log("dado roll status", g.status, "loc", g.headers.get("location"));
    const loc = g.headers.get("location");
    if (loc) {
      const g2 = await fetch("http://127.0.0.1:3000" + loc.replace("http://127.0.0.1:3000", ""), {
        headers: { Cookie: cookie },
      });
      const gh = await g2.text();
      console.log("dado face tip present", /Olhar|Cheirar|Tocar|Lamber|Provar|Tolerar/.test(gh));
    }
  }

  // Chat ask two different questions
  const fd1 = new URLSearchParams({
    childId: child || "",
    content: "Como usar a Escada do Comer sem pressão?",
  });
  const c1 = await fetch("http://127.0.0.1:3000/api/chat/ask", {
    method: "POST",
    headers: { Cookie: cookie, "Content-Type": "application/x-www-form-urlencoded" },
    body: fd1,
    redirect: "manual",
  });
  const loc1 = c1.headers.get("location");
  console.log("chat1", c1.status, loc1);
  const ch1 = await fetch("http://127.0.0.1:3000" + (loc1 || "/app/chat").replace(/^https?:\/\/[^/]+/, ""), {
    headers: { Cookie: cookie },
  });
  const chatHtml1 = await ch1.text();
  const asst1 = [...chatHtml1.matchAll(/bg-\[var\(--brand-soft\)\][^>]*>([\s\S]*?)<\/div>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").trim().slice(0, 120)
  );
  console.log("reply1", asst1[asst1.length - 1]?.slice(0, 160));

  const fd2 = new URLSearchParams({
    childId: child || "",
    content: "TDAH e fuga da mesa: o que tentar primeiro?",
  });
  const c2 = await fetch("http://127.0.0.1:3000/api/chat/ask", {
    method: "POST",
    headers: { Cookie: cookie, "Content-Type": "application/x-www-form-urlencoded" },
    body: fd2,
    redirect: "manual",
  });
  const loc2 = c2.headers.get("location");
  console.log("chat2", c2.status, loc2);
  const ch2 = await fetch("http://127.0.0.1:3000" + (loc2 || "/app/chat").replace(/^https?:\/\/[^/]+/, ""), {
    headers: { Cookie: cookie },
  });
  const chatHtml2 = await ch2.text();
  const asst2 = [...chatHtml2.matchAll(/bg-\[var\(--brand-soft\)\][^>]*>([\s\S]*?)<\/div>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").trim()
  );
  console.log("reply2", asst2[asst2.length - 1]?.slice(0, 160));
  console.log("repliesDifferent", asst1[asst1.length - 1] !== asst2[asst2.length - 1]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

