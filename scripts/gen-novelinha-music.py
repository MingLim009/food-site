import math
import os
import struct
import wave

"""Fundo infantil instrumental animado para a Novelinha (sem clima assustador)."""

out = os.path.join(
    os.path.dirname(__file__),
    "..",
    "public",
    "novelinha",
    "fundo-lento.wav",
)
out = os.path.abspath(out)
os.makedirs(os.path.dirname(out), exist_ok=True)

sr = 22050
duration = 32.0
n = int(sr * duration)

# Progressão alegre em C maior (infantil)
# C - G - Am - F  (I-V-vi-IV)
chords = [
    [261.63, 329.63, 392.00],   # C
    [196.00, 246.94, 392.00],   # G
    [220.00, 261.63, 329.63],   # Am
    [174.61, 220.00, 349.23],   # F
]

# Melodia simples estilo music box / xilofone
melody = [
    523.25, 587.33, 659.25, 587.33,
    523.25, 392.00, 440.00, 523.25,
    587.33, 659.25, 783.99, 659.25,
    587.33, 523.25, 440.00, 392.00,
]
beat = 0.5  # 120 BPM feel (animado mas suave)
seg = duration / len(chords)


def soft_pluck(freq, phase, t_local, decay=0.35):
    """Som tipo xilofone / music box."""
    env = math.exp(-t_local / decay) if t_local >= 0 else 0.0
    # partials bright but soft
    return env * (
        math.sin(2 * math.pi * freq * phase)
        + 0.35 * math.sin(2 * math.pi * freq * 2 * phase)
        + 0.12 * math.sin(2 * math.pi * freq * 3 * phase)
    )


samples = []
for i in range(n):
    t = i / sr
    ci = min(len(chords) - 1, int(t / seg))
    local = t - ci * seg
    chord = chords[ci]
    next_c = chords[(ci + 1) % len(chords)]
    blend = max(0.0, (local - (seg - 1.2)) / 1.2) if local > seg - 1.2 else 0.0

    # Pad alegre (sem vibrato lento assustador)
    pad = 0.0
    for f in chord:
        pad += math.sin(2 * math.pi * f * t) * (1.0 - blend)
    for f in next_c:
        pad += math.sin(2 * math.pi * f * t) * blend
    pad /= 3.0

    # Melodia pluck
    note_i = int(t / beat) % len(melody)
    note_t = t - note_i * beat - (t // (beat * len(melody))) * (beat * len(melody))
    # local time within current note
    note_local = t % beat
    mel = soft_pluck(melody[note_i], t, note_local, decay=0.42)

    # Baixo leve rítmico (a cada 2 beats)
    bass_on = 1.0 if (int(t / beat) % 2 == 0) else 0.55
    bass_f = chord[0] / 2
    bass = bass_on * math.sin(2 * math.pi * bass_f * t) * math.exp(-(t % (beat * 2)) / 0.9)

    # Chime leve no 1º beat do compassinho
    chime = 0.0
    if (t % (beat * 4)) < 0.12:
        chime = math.sin(2 * math.pi * 1046.5 * t) * math.exp(-(t % (beat * 4)) / 0.08)

    val = pad * 0.32 + mel * 0.48 + bass * 0.18 + chime * 0.12

    edge = 1.0
    fade_len = int(sr * 0.8)
    if i < fade_len:
        edge = i / fade_len
    elif i > n - fade_len:
        edge = (n - i) / fade_len

    amp = 0.22 * edge
    samples.append(max(-1.0, min(1.0, val * amp)))

with wave.open(out, "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr)
    frames = b"".join(struct.pack("<h", int(s * 32767)) for s in samples)
    w.writeframes(frames)

print(out, os.path.getsize(out))
