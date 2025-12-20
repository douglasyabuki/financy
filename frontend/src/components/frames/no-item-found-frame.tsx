import { cn } from "@/lib/utils";
import { FileSearchCorner } from "lucide-react";
import { type ComponentProps } from "react";

interface NoItemFoundFrame extends ComponentProps<"div"> {
  text?: string;
  iconClassName?: string;
}

export const NoItemFoundFrame = ({
  text,
  className,
  iconClassName,
  ...props
}: NoItemFoundFrame) => {
  return (
    <div
      className={cn(
        "flex h-fit flex-col items-center justify-center gap-4 py-32",
        className,
      )}
      {...props}
    >
      <FileSearchCorner
        className={cn("size-16 text-gray-500", iconClassName)}
      />
      {text && (
        <p className="mt-2 text-base leading-6 tracking-normal text-gray-600">
          {text}
        </p>
      )}
    </div>
  );
};
