"use client";

import { useDialogServiceStore } from "@/hooks/use-dialog-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export const DialogService = () => {
  const alertTitle = useDialogServiceStore((state) => state.alert.title);
  const alertDescription = useDialogServiceStore(
    (state) => state.alert.message,
  );
  const alertButtonText = useDialogServiceStore(
    (state) => state.alert.buttonText,
  );
  const alertIsOpened = useDialogServiceStore((state) => state.alert.isOpened);
  const alertOnClickAction = useDialogServiceStore(
    (state) => state.alert.onClickAction,
  );

  const confirmTitle = useDialogServiceStore((state) => state.confirm.title);
  const confirmDescription = useDialogServiceStore(
    (state) => state.confirm.message,
  );
  const confirmButtonText = useDialogServiceStore(
    (state) => state.confirm.buttonText,
  );
  const confirmIsOpened = useDialogServiceStore(
    (state) => state.confirm.isOpened,
  );
  const confirmOnClickAction = useDialogServiceStore(
    (state) => state.confirm.onClickAction,
  );

  return (
    <>
      <AlertDialog open={alertIsOpened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground">
              {alertDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => alertOnClickAction?.(true)}>
              {alertButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmIsOpened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground">
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => confirmOnClickAction?.(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmOnClickAction?.(true)}>
              {confirmButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
