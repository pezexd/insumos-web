import type { Database } from "~/types/supabase";

export default function useControl() {
  const client = useSupabaseClient<Database>();
  const toast = useToast();

  const supply = async (id: any, quantity: any, date: any) => {
    const { data } = await client
      .from("supplies")
      .select("id, stock")
      .eq("id", id)
      .single();

    if (data) {
      const { error } = await client
        .from("supplies")
        .update({
          stock: data.stock + quantity,
        })
        .eq("id", id);

      if (error) return;

      await client.from("control").insert({
        date,
        quantity,
        supply_id: data.id,
        type: "supply",
      });
    }
  };

  const give = async (id: any, quantity: any, date: any) => {
    const { data } = await client
      .from("supplies")
      .select("id, stock")
      .eq("id", id)
      .single();

    if (data) {
      if (quantity > data.stock!) {
        toast.add({
          description: "La cantidad a entregar es mayor a la que se tiene",
        });
        return;
      }

      const { error } = await client
        .from("supplies")
        .update({
          stock: data.stock! - quantity,
        })
        .eq("id", id);

      if (error) return;

      await client.from("control").insert({
        date,
        quantity,
        supply_id: data.id,
        type: "give",
      });
    }
  };

  return {
    give,
    supply,
  };
}
