import { NextResponse } from "next/server";
import { getMonetizzeCheckoutUrl } from "@/lib/monetizze";

export async function GET() {
  return NextResponse.json({
    checkouts: {
      BASIC: getMonetizzeCheckoutUrl("BASIC"),
      PREMIUM: getMonetizzeCheckoutUrl("PREMIUM"),
      GOLD: getMonetizzeCheckoutUrl("GOLD"),
    },
    postback: "/api/monetizze/postback",
  });
}
