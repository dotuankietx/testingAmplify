import { create } from "zustand";

interface IOption {
  label: string;
  value: string;
}
interface ISelectStore {
  data: Record<string, IOption[]>;
  setData: (resource: string, options: IOption[]) => void;
  appendData: (resource: string, options: IOption[]) => void;
  clearData: (resource: string) => void;
}

const useSelectStore = create<ISelectStore>((set) => ({
  data: {},
  setData: (resource, options) =>
    set((state) => ({
      data: {
        ...state.data,
        [resource]: options,
      },
    })),
  appendData: (resource, options) =>
    set((state) => ({
      data: {
        ...state.data,
        [resource]: [...(state.data[resource] || []), ...options],
      },
    })),
  clearData: (resource) =>
    set((state) => {
      const resources = [];
      for (const key in state.data) {
        if (resource.includes(key)) {
          resources.push(key);
        }
      }
      for (const key of resources) {
        delete state.data[key];
      }
      return {
        data: {
          ...state.data,
        },
      };
    }),
}));

export default useSelectStore;
