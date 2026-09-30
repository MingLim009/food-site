import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
  label?: string;
  /** Mantido por compatibilidade — a imagem oficial já é colorida. */
  variant?: "brand" | "light";
};

/** Laço do autismo (quebra-cabeça colorido) — símbolo oficial na capa de acesso. */
export function AutismRibbon({
  size = 72,
  className = "",
  label = "Laço do autismo",
}: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label={label}
    >
      <Image
        src="/brand/laco-autismo.png"
        alt=""
        width={size}
        height={Math.round(size * 1.15)}
        className="h-auto w-auto object-contain drop-shadow-sm"
        style={{ width: size, height: "auto" }}
        priority
      />
    </span>
  );
}
