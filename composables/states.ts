export const useControlState = () =>
  useState<{ selectedId: number | null }>("control", () => ({
    selectedId: null,
  }));
