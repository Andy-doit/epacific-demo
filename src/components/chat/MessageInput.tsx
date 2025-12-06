import { useState, useRef } from "react";
import { Send, Smile, Paperclip, Image as ImageIcon, X, File } from "lucide-react";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatFileSize } from "@/utils/format";

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onSendFile: (file: File) => void;
  onSendImage: (file: File) => void;
  onSendEmoji: (emoji: string) => void;
  disabled?: boolean;
}

export function MessageInput({
  message,
  onMessageChange,
  onSendMessage,
  onSendFile,
  onSendImage,
  onSendEmoji,
  disabled = false,
}: MessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    url: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (!disabled) {
      onSendEmoji(emojiData.emoji);
      setShowEmojiPicker(false);
    } else {
      onMessageChange(message + emojiData.emoji);
      setShowEmojiPicker(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        if (!disabled) {
          onSendImage(file);
          e.target.value = "";
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result as string);
            setSelectedFile(null);
          };
          reader.readAsDataURL(file);
        }
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!disabled) {
        onSendFile(file);
        e.target.value = "";
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFile({
            name: file.name,
            size: file.size,
            url: reader.result as string,
          });
          setSelectedImage(null);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSend = () => {
    if (selectedImage && imageInputRef.current?.files?.[0]) {
      onSendImage(imageInputRef.current.files[0]);
      setSelectedImage(null);
      imageInputRef.current.value = "";
    } else if (selectedFile && fileInputRef.current?.files?.[0]) {
      onSendFile(fileInputRef.current.files[0]);
      setSelectedFile(null);
      fileInputRef.current.value = "";
    } else {
      onSendMessage();
    }
  };

  return (
    <>
      <Separator />
      <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border/50">
        {(selectedImage || selectedFile) && (
          <div className="mb-3 flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            {selectedFile && (
              <div className="flex items-center gap-2 flex-1">
                <File className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageSelect}
              className="hidden"
              accept="image/*"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="pr-10 min-h-[44px] rounded-xl border-border/50 shadow-sm focus:ring-2 focus:ring-primary/20"
            />
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-0 shadow-lg"
                align="end"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={350}
                  height={400}
                  previewConfig={{ showPreview: false }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={handleSend}
            disabled={
              (!message.trim() && !selectedImage && !selectedFile) || disabled
            }
            className="h-[44px] px-6 rounded-xl shadow-sm bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </>
  );
}

