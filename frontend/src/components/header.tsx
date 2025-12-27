import logoIcon from "@/assets/logo-icon.svg";
import logo from "@/assets/logo.svg";
import { getInitials } from "@/utils/initials";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../stores/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface HeaderLink {
  to: string;
  children: React.ReactNode;
}

const HeaderLink = ({ to, children }: HeaderLink) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge(
          "hover:border-b-primary border-b border-transparent text-sm leading-5 tracking-normal duration-150",
          isActive ? "text-primary font-semibold" : "font-medium text-gray-600",
        )
      }
    >
      {children}
    </NavLink>
  );
};

export const Header = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return null;

  return (
    <div className="bg-card w-full px-12 py-4">
      <div className="relative flex w-full justify-between">
        <div className="hidden lg:block">
          <img src={logo} />
        </div>
        <div className="lg:hidden">
          <img src={logoIcon} />
        </div>
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-5">
          <HeaderLink to="/">Dashboard</HeaderLink>
          <HeaderLink to="/transactions">Transações</HeaderLink>
          <HeaderLink to="/categories">Categorias</HeaderLink>
        </div>
        <div className="flex flex-1 justify-end">
          <NavLink to="/profile">
            <Avatar className="size-9">
              {user?.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              )}
              <AvatarFallback className="bg-gray-300 text-sm leading-5 tracking-normal text-gray-800">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
