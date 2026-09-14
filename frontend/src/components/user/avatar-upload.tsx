import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/initials";
import { Camera, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AvatarUpload {
  currentAvatarUrl?: string;
  name: string;
  onFileSelect: (file: File | null) => void;
  onAvatarRemove: () => void;
  isLoading?: boolean;
}

export const AvatarUpload = ({
  currentAvatarUrl,
  name,
  onFileSelect,
  onAvatarRemove,
  isLoading,
}: AvatarUpload) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    currentAvatarUrl,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentAvatarUrl);
  }, [currentAvatarUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleRemove();
    if (currentAvatarUrl) {
      onAvatarRemove();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="group relative h-24 w-24 overflow-hidden rounded-full">
        <Avatar className="border-border size-full border-2">
          <AvatarImage src={previewUrl} className="object-cover" />
          <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-medium">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {!previewUrl ? (
            <div
              className="flex size-full cursor-pointer items-center justify-center"
              onClick={handleEditClick}
            >
              <Camera className="h-8 w-8 text-white" />
            </div>
          ) : (
            <div className="flex size-full">
              <div
                className="flex flex-1 cursor-pointer items-center justify-center transition-colors hover:bg-black/20"
                onClick={handleEditClick}
              >
                <Pencil className="h-6 w-6 text-white" />
              </div>
              <div
                className="hover:bg-destructive/80 flex flex-1 cursor-pointer items-center justify-center transition-colors"
                onClick={handleTrashClick}
              >
                <Trash2 className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </div>
  );
};
