import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface Link {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export const Link = ({ to, children, className }: Link) => {
  return (
    <NavLink
      to={to}
      className={cn(
        "text-brand-base flex w-fit items-center justify-end gap-1 text-sm leading-5 font-medium tracking-normal underline-offset-3 duration-150 hover:underline",
        className,
      )}
    >
      {children}
    </NavLink>
  );
};
