"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  childId: string;
  conversationId?: string;
};

type RecResult = { results: { [i: number]: { [j: number]: { transcript: string } }; length: number } };

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const pt = voices.filter((v) => /pt-BR|pt_BR|Portuguese/i.test(v.lang + v.name));
  const femaleHints =
    /female|feminina|woman|maria|lucia|luciana|francisca|heloisa|vitória|vitoria|google português do brasil|microsoft maria|microsoft francisca/i;
  return (
    pt.find((v) => femaleHints.test(v.name)) ||
    pt.find((v) => !/male|masculin|daniel|ricardo|pt-pt/i.test(v.name)) ||
    pt[0] ||
    null
  );
}

/** Narração em português com voz feminina (receitas / TIA). */
export function speakPortugueseFemale(
  text: string,
  opts?: { onEnd?: () => void; rate?: number }
): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    opts?.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const clean = text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/[*_#>`]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1200);
  if (!clean) {
    opts?.onEnd?.();
    return;
  }
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = "pt-BR";
  u.rate = opts?.rate ?? 0.95;
  u.pitch = 1.15;
  const voice = pickFemaleVoice();
  if (voice) u.voice = voice;
  u.onend = () => opts?.onEnd?.();
  u.onerror = () => opts?.onEnd?.();
  window.speechSynthesis.getVoices();
  window.speechSynthesis.speak(u);
}

export function stopSpeech() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

export function ChatVoiceControls({ childId, conversationId }: Props) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<{ stop: () => void; start: () => void } | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function startListen() {
    setError("");
    const w = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        continuous: boolean;
        start: () => void;
        stop: () => void;
        onresult: ((ev: RecResult) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        continuous: boolean;
        start: () => void;
        stop: () => void;
        onresult: ((ev: RecResult) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
      };
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setError("Seu navegador não suporta ditado por voz. Use Chrome ou Edge.");
      return;
    }
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.interimResults = true;
    rec.continuous = false;
    recognitionRef.current = rec;
    rec.onresult = (ev) => {
      let text = "";
      for (let i = 0; i < ev.results.length; i++) {
        text += ev.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };
    rec.onerror = () => {
      setListening(false);
      setError("Não consegui ouvir. Permita o microfone e tente de novo.");
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  function stopListen() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return (
    <div className="card space-y-3 p-4">
      <p className="text-sm font-bold">Falar em vez de digitar</p>
      <p className="text-xs text-[var(--muted)]">
        Toque no microfone, fale a pergunta e envie. Nas respostas, use “Ouvir” (voz feminina da TIA
        Nutri).
      </p>
      <div className="flex flex-wrap gap-2">
        {!listening ? (
          <button type="button" className="btn btn-secondary" onClick={startListen}>
            🎤 Falar pergunta
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={stopListen}>
            ⏹ Parar
          </button>
        )}
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {transcript ? (
        <form action="/api/chat/ask" method="post" className="space-y-2">
          <input type="hidden" name="childId" value={childId} />
          {conversationId ? (
            <input type="hidden" name="conversationId" value={conversationId} />
          ) : null}
          <textarea
            className="input min-h-20"
            name="content"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            required
          />
          <button className="btn btn-primary w-full" type="submit">
            Enviar pergunta por voz
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const mark = () => setReady(true);
    mark();
    window.speechSynthesis.onvoiceschanged = mark;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const clean = text
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .replace(/[*_#>`]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1200);
    setSpeaking(true);
    if (!ready) window.speechSynthesis.getVoices();
    speakPortugueseFemale(clean, {
      onEnd: () => setSpeaking(false),
    });
  }

  function stop() {
    stopSpeech();
    setSpeaking(false);
  }

  return speaking ? (
    <button type="button" className="text-xs font-bold text-[var(--brand)]" onClick={stop}>
      Parar áudio
    </button>
  ) : (
    <button type="button" className="text-xs font-bold text-[var(--brand)]" onClick={speak}>
      🔊 Ouvir (voz feminina)
    </button>
  );
}

export function ClearChatButton({
  childId,
  conversationId,
}: {
  childId: string;
  conversationId?: string;
}) {
  if (!conversationId && !childId) return null;
  return (
    <form action="/api/chat/clear" method="post">
      <input type="hidden" name="childId" value={childId} />
      {conversationId ? <input type="hidden" name="conversationId" value={conversationId} /> : null}
      <button
        type="submit"
        className="text-xs font-bold text-[var(--danger)]"
        onClick={(e) => {
          if (!confirm("Apagar o histórico de perguntas desta conversa?")) e.preventDefault();
        }}
      >
        Limpar histórico
      </button>
    </form>
  );
}
