import { createClient } from "@/lib/supabase/server";
import { getOpenMistakes } from "@/lib/mistakes";
import { isAiEnabled } from "@/lib/ai/tutor";
import { MistakesManager } from "./mistakes-manager";

export default async function MistakesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mistakes = user ? await getOpenMistakes(user.id) : [];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pt-8 md:p-8">
      <h1 className="text-2xl font-bold text-text">Mistakes bank</h1>
      <MistakesManager mistakes={mistakes} aiEnabled={isAiEnabled()} />
    </div>
  );
}
