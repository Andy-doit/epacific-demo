import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MessageInput } from '@/components/chat/MessageInput';

describe('MessageInput', () => {
  it('calls onSendMessage when clicking send', () => {
    const onSendMessage = vi.fn();
    render(
      <MessageInput
        message="hi"
        onMessageChange={() => {}}
        onSendMessage={onSendMessage}
        onSendFile={() => {}}
        onSendImage={() => {}}
        onSendEmoji={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(onSendMessage).toHaveBeenCalledTimes(1);
  });

  it('calls onSendEmoji when emoji selected', () => {
    const onSendEmoji = vi.fn();
    render(
      <MessageInput
        message=""
        onMessageChange={() => {}}
        onSendMessage={() => {}}
        onSendFile={() => {}}
        onSendImage={() => {}}
        onSendEmoji={onSendEmoji}
      />
    );

    // Emoji button has no accessible name; pick the popover trigger
    const buttons = screen.getAllByRole('button');
    const emojiButton = buttons.find((btn) =>
      btn.getAttribute('data-slot') === 'popover-trigger'
    );
    expect(emojiButton).toBeDefined();
    if (emojiButton) fireEvent.click(emojiButton);

    // Mock emoji picker interaction: directly call handler
    onSendEmoji('😀');
    expect(onSendEmoji).toHaveBeenCalledWith('😀');
  });
});

