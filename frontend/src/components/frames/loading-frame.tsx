import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { type ComponentProps } from "react";

interface LoadingFrame extends ComponentProps<"div"> {
  text?: string;
  iconClassName?: string;
  spanDots?: boolean;
}

const Dots = () => {
  return (
    <div className="flex h-1 gap-1">
      {[0, 300, 600].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-pulse rounded-full bg-gray-600 ease-in-out"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
};

export const LoadingFrame = ({
  text,
  className,
  iconClassName,
  spanDots,
  ...props
}: LoadingFrame) => {
  return (
    <div
      className={cn(
        "flex h-fit flex-col items-center justify-center gap-4 py-32",
        className,
      )}
      {...props}
    >
      <Loader
        className={cn(
          "text-primary size-10 animate-[spin_2s_linear_infinite]",
          iconClassName,
        )}
      />
      {text && (
        <p className="mt-2 text-lg leading-6 font-medium tracking-normal text-gray-700">
          {text}
        </p>
      )}
      {spanDots && <Dots />}
    </div>
  );
};
