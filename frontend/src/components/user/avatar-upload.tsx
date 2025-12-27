import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/utils/initials";
import { Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

interface AvatarUpload {
  currentAvatarUrl?: string;
  name: string;
  onFileSelect: (file: File | null) => void;
  isLoading?: boolean;
}

export const AvatarUpload = ({
  currentAvatarUrl,
  name,
  onFileSelect,
  isLoading,
}: AvatarUpload) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="group relative cursor-pointer" onClick={handleClick}>
        <Avatar className="border-border size-24 border-2">
          {previewUrl && (
            <AvatarImage src={previewUrl} className="object-cover" />
          )}
          <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-medium">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-8 w-8 text-white" />
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

      {previewUrl && previewUrl !== currentAvatarUrl && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive/90 transition-colors"
          onClick={handleRemove}
          disabled={isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remover seleção
        </Button>
      )}
    </div>
  );
};
