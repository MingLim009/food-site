"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { speakPortugueseFemale, stopSpeech } from "@/components/chat-voice";

export type CartoonScene = {
  title: string;
  emoji: string;
  narration: string;
  bg: string;
};

type Props = {
  recipeTitle: string;
  scenes: CartoonScene[];
};

export function CartoonVideoPlayer({ recipeTitle, scenes }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const playGen = useRef(0);

  // Narração + avanço de cena quando o áudio termina
  useEffect(() => {
    if (!playing || scenes.length === 0) return;
    const scene = scenes[Math.min(index, scenes.length - 1)];
    const gen = ++playGen.current;
    let finished = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    function goNext() {
      if (finished || playGen.current !== gen) return;
      finished = true;
      setSpeaking(false);
      setIndex((i) => {
        if (i >= scenes.length - 1) {
          setPlaying(false);
          setDone(true);
          return i;
        }
        return i + 1;
      });
    }

    // tempo mínimo na cena + fallback se TTS falhar
    const minMs = 2200;
    const maxMs = audioOn
      ? Math.max(5000, Math.min(14000, scene.narration.length * 70))
      : 2800;
    const minReady = Date.now() + minMs;
    fallbackTimer = setTimeout(goNext, maxMs);

    if (audioOn) {
      setSpeaking(true);
      speakPortugueseFemale(`${scene.title}. ${scene.narration}`, {
        rate: 0.98,
        onEnd: () => {
          if (playGen.current !== gen) return;
          setSpeaking(false);
          const wait = Math.max(0, minReady - Date.now());
          setTimeout(() => {
            if (fallbackTimer) clearTimeout(fallbackTimer);
            goNext();
          }, wait);
        },
      });
    } else {
      setSpeaking(false);
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      stopSpeech();
    };
  }, [playing, index, scenes, audioOn]);

  // Parar áudio ao desmontar / pausar
  useEffect(() => {
    if (!playing) {
      stopSpeech();
      setSpeaking(false);
    }
  }, [playing]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  if (!scenes.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg-soft)] p-4 text-sm text-[var(--muted)]">
        Desenho 3D desta receita em preparação.
      </div>
    );
  }

  const scene = scenes[Math.min(index, scenes.length - 1)];
  const progress = ((index + (done ? 1 : 0)) / scenes.length) * 100;

  function restart() {
    stopSpeech();
    setIndex(0);
    setDone(false);
    setPlaying(true);
  }

  function togglePlay() {
    if (playing) {
      stopSpeech();
      setPlaying(false);
      setSpeaking(false);
    } else {
      setDone(false);
      setPlaying(true);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_10px_28px_rgba(30,107,184,0.08)]">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded-lg bg-[var(--tea-gold-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#9a6b0a]">
            Vídeo 3D + áudio
          </span>
          <p className="truncate text-xs font-bold text-[var(--brand-deep)]">{recipeTitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
              audioOn
                ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                : "border-[var(--line)] text-[var(--muted)]"
            }`}
            onClick={() => {
              if (audioOn) stopSpeech();
              setAudioOn((v) => !v);
            }}
            aria-pressed={audioOn}
            aria-label={audioOn ? "Desligar narração" : "Ligar narração"}
          >
            {audioOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {audioOn ? (speaking ? "Falando…" : "Áudio") : "Mudo"}
          </button>
          <p className="text-[11px] font-semibold text-[var(--muted)]">
            {index + 1}/{scenes.length}
          </p>
        </div>
      </div>

      <div
        key={index}
        className="recipe-3d-stage relative flex min-h-60 flex-col items-center justify-center overflow-hidden px-5 py-10 text-center sm:min-h-72"
        style={{ background: scene.bg }}
      >
        <div className="recipe-3d-floor pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden />
        <div className="recipe-3d-glow pointer-events-none absolute left-1/2 top-8 h-28 w-28 -translate-x-1/2 rounded-full" aria-hidden />

        <div className="recipe-3d-prop cartoon-bounce relative z-[1]" aria-hidden>
          <span className="recipe-3d-emoji">{scene.emoji}</span>
          <span className="recipe-3d-shadow" />
        </div>

        <p className="relative z-[1] mt-5 text-xs font-bold uppercase tracking-wide text-[var(--brand)]">
          {scene.title}
        </p>
        <div className="cartoon-fade relative z-[1] mt-3 w-full max-w-lg rounded-2xl bg-white/95 px-4 py-3 shadow-md">
          <div className="mb-1 flex items-center justify-center gap-1 text-[var(--accent-dark,#9a6b0a)]">
            <Volume2 size={14} />
            <span className="text-[10px] font-bold uppercase">
              {audioOn ? "Narração em áudio" : "Narração (mudo)"}
            </span>
          </div>
          <p className="text-sm font-semibold leading-relaxed text-[var(--ink)] sm:text-base">
            {scene.narration}
          </p>
        </div>
      </div>

      <div className="h-1.5 bg-[var(--bg-soft)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${Math.min(100, progress || ((index + 1) / scenes.length) * 100)}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 p-3">
        {done ? (
          <button type="button" className="btn btn-primary gap-2" onClick={restart}>
            <RotateCcw size={16} />
            Ver de novo
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary min-h-12 gap-2 px-6 text-base"
            onClick={togglePlay}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
            {playing ? "Pausar" : index === 0 ? "▶ Assistir com áudio" : "Continuar"}
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost text-sm"
          onClick={() => {
            stopSpeech();
            setPlaying(false);
            setSpeaking(false);
            setDone(false);
            setIndex((i) => Math.max(0, i - 1));
          }}
          disabled={index === 0}
        >
          ◀ Anterior
        </button>
        <button
          type="button"
          className="btn btn-ghost text-sm"
          onClick={() => {
            stopSpeech();
            setPlaying(false);
            setSpeaking(false);
            setDone(index + 1 >= scenes.length - 1);
            setIndex((i) => Math.min(scenes.length - 1, i + 1));
          }}
        >
          Próxima cena ▶
        </button>
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--bg-soft)] px-3 py-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">
          Todas as cenas (toque para pular)
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {scenes.map((s, i) => (
            <button
              key={`${s.title}-${i}`}
              type="button"
              onClick={() => {
                stopSpeech();
                setIndex(i);
                setPlaying(false);
                setSpeaking(false);
                setDone(false);
              }}
              className={`rounded-xl border px-3 py-2 text-left transition ${
                i === index
                  ? "border-[var(--brand)] bg-white shadow-sm"
                  : "border-transparent bg-white/70 hover:border-[var(--line)]"
              }`}
            >
              <span className="mr-1 text-lg" aria-hidden>
                {s.emoji}
              </span>
              <span className="text-xs font-bold">{s.title}</span>
              <p className="mt-1 line-clamp-2 text-[11px] text-[var(--muted)]">{s.narration}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
