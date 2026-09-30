"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";

const STORAGE_KEY = "elo_novelinha_music";
const SRC = "/novelinha/fundo-lento.wav";

/**
 * Fundo musical lento da Novelinha.
 * Navegadores bloqueiam autoplay: inicia após o primeiro toque no botão
 * (ou retoma se o usuário já tinha ligado antes nesta sessão).
 */
export function NovelinhaMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.78;
    audioRef.current = audio;
    setReady(true);

    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === "1") {
      audio
        .play()
        .then(() => setOn(true))
        .catch(() => setOn(false));
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (on) {
      audio.pause();
      setOn(false);
      sessionStorage.setItem(STORAGE_KEY, "0");
      return;
    }
    try {
      await audio.play();
      setOn(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      setOn(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold transition ${
        on
          ? "border-[var(--brand)] bg-[var(--brand)] text-white"
          : "border-[var(--line)] bg-white text-[var(--brand-deep)]"
      }`}
      aria-pressed={on}
      aria-label={on ? "Desligar música de fundo" : "Ligar música de fundo lenta"}
    >
      {on ? <Music2 size={18} aria-hidden /> : <VolumeX size={18} aria-hidden />}
      {on ? "Música ligada" : "Música lenta"}
    </button>
  );
}
