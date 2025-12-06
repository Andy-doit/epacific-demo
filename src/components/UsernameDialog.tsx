import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface UsernameDialogProps {
  open: boolean;
  onUsernameSet: (username: string) => void;
}

export function UsernameDialog({ open, onUsernameSet }: UsernameDialogProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved username from localStorage
    const saved = localStorage.getItem('chat-username');
    if (saved) {
      setUsername(saved);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    if (trimmedUsername.length < 2) {
      setError('Tên phải có ít nhất 2 ký tự');
      return;
    }

    if (trimmedUsername.length > 20) {
      setError('Tên không được quá 20 ký tự');
      return;
    }

    localStorage.setItem('chat-username', trimmedUsername);
    onUsernameSet(trimmedUsername);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chào mừng đến với Chat</DialogTitle>
          <DialogDescription>
            Vui lòng nhập tên của bạn để bắt đầu chat
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên của bạn</Label>
              <Input
                id="username"
                placeholder="Nhập tên của bạn"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
                autoFocus
                maxLength={20}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!username.trim()}>
              Bắt đầu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

