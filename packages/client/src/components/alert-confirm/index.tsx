import type { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AlertDialogConfirm(props: {
  title: string | ReactNode;
  description: string | ReactNode;
  children?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  const { title, description, children, open, setOpen, onConfirm, onCancel } = props;

  return (
    <AlertDialog {...(open !== undefined ? { open } : {})} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel {...(onCancel !== undefined ? { onClick: onCancel } : {})}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm?.();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
