import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MessageList } from '@/components/chat/MessageList';
import type { Message } from '@/types/chat';

const baseMessage: Message = {
  id: '1',
  from: { socketId: 'a', username: 'Alice' },
  message: 'Hello',
  timestamp: new Date().toISOString(),
  type: 'text',
  isOwn: true,
};

describe('MessageList', () => {
  const messagesEndRef = { current: null } as React.RefObject<HTMLDivElement>;
  const scrollAreaRef = { current: null } as React.RefObject<HTMLDivElement>;

  it('renders messages', () => {
    render(
      <MessageList
        messages={[baseMessage]}
        messagesEndRef={messagesEndRef}
        scrollAreaRef={scrollAreaRef}
      />
    );

    expect(screen.getByText(/You joined the chat/i)).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('shows empty state when no messages', () => {
    render(
      <MessageList
        messages={[]}
        messagesEndRef={messagesEndRef}
        scrollAreaRef={scrollAreaRef}
      />
    );

    expect(
      screen.getByText(/No messages yet\. Start the conversation!/i)
    ).toBeInTheDocument();
  });
});

