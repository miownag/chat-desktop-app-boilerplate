import React, { ReactNode } from "react";
import { Button } from "../ui/button";

interface SelectedBtnProps {
  icon: ReactNode;
  label: string;
  className?: string;
  selected?: boolean;
  setSelected?: React.Dispatch<React.SetStateAction<boolean>>;
}

function SelectedBtn({ selected, setSelected, label, icon }: SelectedBtnProps) {
  const handleOnClick = () => {
    setSelected?.((selected) => !selected);
  };
  return (
    <Button
      variant="outline"
      className={`rounded-full cursor-pointer${
        selected
          ? " border-blue-500 text-blue-500 hover:text-blue-500 hover:bg-blue-50"
          : ""
      }`}
      onClick={handleOnClick}
    >
      {icon}
      {label}
    </Button>
  );
}

export default SelectedBtn;
