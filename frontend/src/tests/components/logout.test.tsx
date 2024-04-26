import { render, fireEvent } from '@testing-library/react';
import Logout from '../../components/Logout';
import { vi } from 'vitest';

// Mocking localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mocking window.location.reload()
const reloadMock = vi.fn();
Object.defineProperty(window, 'location', { value: { reload: reloadMock } });

describe('Logout Component', () => {
  test('removes token from localStorage and reloads the page on click', () => {
    // Set up: Add token to localStorage
    localStorage.setItem('token', 'fake-token');

    // Render the component
    const { getByText } = render(<Logout />);

    // Simulate click on logout button
    const logoutButton = getByText('logout') as HTMLButtonElement;
    fireEvent.click(logoutButton);

    // Assert that token is removed from localStorage
    expect(localStorage.getItem('token')).toBeUndefined();

    // Assert that window.location.reload() is called
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
