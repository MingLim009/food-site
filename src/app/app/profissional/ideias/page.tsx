import { ProCategoryView, requireProUser } from "@/components/pro-area";

export default async function Page() {
  await requireProUser();
  return (
    <ProCategoryView
      title="Ideias de terapia alimentar"
      intro="Roteiros prontos para inspirar sessões — adapte ao perfil clínico."
      category="ideia"
    />
  );
}
