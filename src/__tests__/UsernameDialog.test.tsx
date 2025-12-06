import { fireEvent, render, screen } from '@testing-library/react';
    import { vi } from 'vitest';
import { UsernameDialog } from '@/components/UsernameDialog';

describe('UsernameDialog', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('calls onUsernameSet when valid username is submitted', () => {
    const onUsernameSet = vi.fn();

    render(<UsernameDialog open onUsernameSet={onUsernameSet} />);

    const input = screen.getByPlaceholderText(/Nhập tên của bạn/i);
    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /Bắt đầu/i }));

    expect(onUsernameSet).toHaveBeenCalledWith('Alice');
  });

  it('shows validation error for empty input', () => {
    const onUsernameSet = vi.fn();

    render(<UsernameDialog open onUsernameSet={onUsernameSet} />);

    fireEvent.click(screen.getByRole('button', { name: /Bắt đầu/i }));

    expect(
      screen.getByText(/Vui lòng nhập tên của bạn/i)
    ).toBeInTheDocument();
    expect(onUsernameSet).not.toHaveBeenCalled();
  });
});

