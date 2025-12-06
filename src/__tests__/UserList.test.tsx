import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { UserList } from '@/components/chat/UserList';
import type { OnlineUser, LastMessage } from '@/types/chat';

const currentUser: OnlineUser = { socketId: 'me', username: 'Me' };
const onlineUsers: OnlineUser[] = [
  { socketId: 'u1', username: 'Alice' },
  { socketId: 'u2', username: 'Bob' },
];
const lastMessages: Record<string, LastMessage> = {
  'room_me_u1': {
    from: { socketId: 'u1', username: 'Alice' },
    content: 'Hi',
    type: 'text',
    timestamp: new Date().toISOString(),
  },
};

describe('UserList', () => {
  it('renders online users and last message', () => {
    const onUserClick = vi.fn();
    render(
      <UserList
        currentUser={currentUser}
        onlineUsers={onlineUsers}
        selectedUserId={null}
        lastMessages={lastMessages}
        onUserClick={onUserClick}
        onLogout={() => {}}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText(/Hi/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Alice'));
    expect(onUserClick).toHaveBeenCalledWith(onlineUsers[0]);
  });
});

