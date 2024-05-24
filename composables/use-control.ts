import type { Database } from "~/types/supabase";

export default function useControl() {
  const client = useSupabaseClient<Database>();
  const toast = useToast();

  const replenishment = async (
    data: Partial<Database["public"]["Tables"]["replenishments"]["Row"]>
  ) => {
    const { data: supply } = await client
      .from("supplies")
      .select("supply_id, current_stock")
      .eq("supply_id", data.supply_id || 0)
      .single();

    if (supply) {
      const { error } = await client
        .from("supplies")
        .update({
          current_stock: supply.current_stock! + data.resupply_quantity!,
        })
        .eq("supply_id", supply.supply_id);

      if (error) return false;

      await client.from("replenishments").insert({
        ...data,
      });

      return true;
    }

    return false;
  };

  const delivery = async (
    data: Partial<Database["public"]["Tables"]["deliveries"]["Row"]>
  ) => {
    const { data: supply } = await client
      .from("supplies")
      .select("supply_id, current_stock")
      .eq("supply_id", data.supply_id || 0)
      .single();

    if (supply) {
      if (data.delivery_quantity! > supply.current_stock!) {
        toast.add({
          description: "La cantidad a entregar es mayor a la que se tiene",
        });
        return true;
      }

      const { error } = await client
        .from("supplies")
        .update({
          current_stock: supply.current_stock! - data.delivery_quantity!,
        })
        .eq("supply_id", supply.supply_id);

      if (error) return true;

      await client.from("deliveries").insert({
        ...data,
      });

      return false;
    }

    return true;
  };

  return {
    delivery,
    replenishment,
  };
}
