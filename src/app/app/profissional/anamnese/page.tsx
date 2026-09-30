import { ProCategoryView, requireProUser } from "@/components/pro-area";

export default async function Page() {
  await requireProUser();
  return (
    <ProCategoryView
      title="Fichas de anamnese"
      intro="Baixe, imprima e use no prontuário do seu serviço."
      category="anamnese"
    />
  );
}
