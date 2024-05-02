export const useControlState = () =>
  useState<{ selectedId: number | null }>("control", () => ({
    selectedId: null,
  }));

// export const useSuppliesOptions = useState("supplies_options", () => []);
// export const useMaintenanceOptions = useState("maintenance_options", () => []);
