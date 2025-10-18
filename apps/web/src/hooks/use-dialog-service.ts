"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const DialogServiceType = {
  alert: "alert",
  confirm: "confirm",
} as const;
export type DialogServiceType =
  (typeof DialogServiceType)[keyof typeof DialogServiceType];

type DialogServiceState = Record<
  DialogServiceType,
  {
    message: string;
    buttonText: string;
    title: string;
    isOpened: boolean;
    onClickAction: ((result: boolean) => void) | null;
  }
>;

type DialogServiceAction = {
  setMessage: <T extends DialogServiceType>(
    type: T,
    message: DialogServiceState[T]["message"],
  ) => void;
  setButtonText: <T extends DialogServiceType>(
    type: T,
    text: DialogServiceState[T]["buttonText"],
  ) => void;
  setTitle: <T extends DialogServiceType>(
    type: T,
    title: DialogServiceState[T]["title"],
  ) => void;
  open: <T extends DialogServiceType>(type: T) => void;
  close: <T extends DialogServiceType>(type: T) => void;
  clear: <T extends DialogServiceType>(type: T) => void;
  setClickAction: <T extends DialogServiceType>(
    type: T,
    onClickAction: (result: boolean) => void,
  ) => void;
};

export const DIALOG_SERVICE_DEFAULT = {
  alert: {
    message: "",
    buttonText: "확인",
    title: "",
    isOpened: false,
    onClickAction: null,
  },
  confirm: {
    message: "",
    buttonText: "확인",
    title: "",
    isOpened: false,
    onClickAction: null,
  },
} satisfies DialogServiceState;

export const useDialogServiceStore = create<
  DialogServiceState & DialogServiceAction
>()(
  subscribeWithSelector((set) => ({
    alert: DIALOG_SERVICE_DEFAULT.alert,
    confirm: DIALOG_SERVICE_DEFAULT.confirm,

    setMessage: (type, message) =>
      set((prev) => ({ [type]: { ...prev[type], message } })),
    setButtonText: (type, text) =>
      set((prev) => ({ [type]: { ...prev[type], buttonText: text } })),
    setTitle: (type, title) =>
      set((prev) => ({ [type]: { ...prev[type], title } })),
    open: (type) =>
      set((prev) => ({ [type]: { ...prev[type], isOpened: true } })),
    close: (type) =>
      set((prev) => ({ [type]: { ...prev[type], isOpened: false } })),
    clear: (type) => set((_prev) => ({ [type]: DIALOG_SERVICE_DEFAULT[type] })),
    setClickAction: (type, onClickAction) =>
      set((prev) => ({ [type]: { ...prev[type], onClickAction } })),
  })),
);

export function useDialogService() {
  const dialogServiceStore = useDialogServiceStore();

  const asyncPrompt = (
    type: DialogServiceType,
    message: string,
    option?: { buttonText: string },
  ) => {
    dialogServiceStore.setButtonText(type, option?.buttonText || "확인");
    dialogServiceStore.setMessage(type, message);
    dialogServiceStore.open(type);

    const promise = new Promise<boolean>((resolve, reject) => {
      dialogServiceStore.setClickAction(type, (result) => {
        try {
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          dialogServiceStore.clear(type);
        }
      });
    });

    return promise;
  };

  const alert = (message: string, option?: { buttonText: string }) => {
    const type = DialogServiceType.alert;
    return asyncPrompt(type, message, option);
  };

  const confirm = (message: string, option?: { buttonText: string }) => {
    const type = DialogServiceType.confirm;
    return asyncPrompt(type, message, option);
  };

  return {
    alert,
    confirm,
  };
}
