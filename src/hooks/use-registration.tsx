import create from "zustand";
import { persist } from "zustand/middleware";

type Fields = {
  phoneNumber: string;
  password: string;
  username: string;
  name: string;
};
type RegistrationStore = {
  fields: Fields;
  setFields: (fieldsData: Fields) => void;
};
export const useRegistrationStore = create<RegistrationStore>()(
  persist(
    set => ({
      fields: { password: "", phoneNumber: "", username: "", name: "" },
      setFields: fieldsData => set(state => ({ ...state, fields: fieldsData })),
    }),
    {
      name: "registration-storage",
      getStorage: () => sessionStorage,
    },
  ),
);
