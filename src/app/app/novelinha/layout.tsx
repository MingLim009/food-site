import { NovelinhaMusic } from "@/components/novelinha-music";

export default function NovelinhaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <NovelinhaMusic />
      </div>
      {children}
    </div>
  );
}
