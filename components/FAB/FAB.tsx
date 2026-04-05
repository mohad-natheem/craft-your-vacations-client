import React from "react";
import Button from "../Button/Button";

type FABPosition = "bottom-right" | "bottom-left";

interface FABProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  position?: FABPosition;
  className?: string;
  "aria-label"?: string;
}

const positionClasses: Record<FABPosition, string> = {
  "bottom-right": "bottom-8 right-8",
  "bottom-left": "bottom-8 left-8",
};

export function FAB({
  icon,
  label,
  onClick,
  position = "bottom-right",
  className = "",
  "aria-label": ariaLabel,
}: FABProps) {
  return (
    <Button
      variant={"icon"}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={`fixed z-40 btn-gradient ${positionClasses[position]}`}
    >
      {icon}
    </Button>
  );
}

export default FAB;
