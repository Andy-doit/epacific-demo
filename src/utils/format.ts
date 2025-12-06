/**
 * Format file size from bytes to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format timestamp to relative time string
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

/**
 * Get user initials from username
 */
export function getInitials(username: string): string {
  return username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Create room ID from two socket IDs (sorted to ensure consistency)
 */
export function createRoomId(socketId1: string, socketId2: string): string {
  return `room_${[socketId1, socketId2].sort().join('_')}`;
}

