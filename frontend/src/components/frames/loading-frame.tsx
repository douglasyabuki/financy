import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader } from "lucide-react";
import { type ComponentProps } from "react";

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

interface LoadingFrame extends ComponentProps<"div"> {
  text?: string;
  iconClassName?: string;
  spanDots?: boolean;
  size?: "md" | "lg";
}

const loadingFrameVariants = cva(
  "flex h-fit flex-col items-center justify-center [&_svg:not([class*='animate-'])]:animate-[spin_2s_linear_infinite] text-lg leading-6 font-medium tracking-normal text-gray-700",
  {
    variants: {
      size: {
        md: "gap-2 py-0 [&_svg:not([class*='size-'])]:size-8",
        lg: "gap-4 py-32 [&_svg:not([class*='size-'])]:size-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const LoadingFrame = ({
  text,
  className,
  iconClassName,
  spanDots,
  size,
  ...props
}: LoadingFrame) => {
  return (
    <div
      className={cn(loadingFrameVariants({ size: "md" }), className)}
      {...props}
    >
      <Loader className={cn("text-primary", iconClassName)} />
      {text && <p className="mt-2">{text}</p>}
      {spanDots && <Dots />}
    </div>
  );
};
