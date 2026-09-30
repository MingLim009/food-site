async function main() {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "mae@demo.com", password: "demo1234" }),
  });
  const text = await res.text();
  console.log("status", res.status);
  console.log("body", text);
  console.log("set-cookie", res.headers.getSetCookie?.() || res.headers.get("set-cookie"));
}

main().catch(console.error);
