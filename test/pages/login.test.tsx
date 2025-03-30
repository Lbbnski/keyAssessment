// test/pages/login.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Login from '../../src/pages/login';
import { LOGIN_JWT } from '../../src/util/user';
import * as userUtils from '../../src/util/user';

// Apollo-Client Mock erstellen
const mocks = [
  {
    request: {
      query: LOGIN_JWT,
      variables: {
        username: 'testuser',
        password: 'password123',
        deviceKind: 'Admin'
      },
    },
    result: {
      data: {
        Auth: {
          loginJwt: {
            jwtTokens: {
              accessToken: 'test-access-token',
              refreshToken: 'test-refresh-token'
            },
            clientMutationId: null
          }
        }
      }
    },
  },
];

describe('Login Komponente', () => {
  beforeEach(() => {
    // Mock für checkAuth und setLoggedIn erstellen
    vi.spyOn(userUtils, 'checkAuth').mockImplementation(() => {});
    vi.spyOn(userUtils, 'setLoggedIn').mockImplementation(() => {});

    // Mocks zurücksetzen
    vi.clearAllMocks();

    // localStorage Mock
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    });

    // setContext Mock erstellen (über setLoggedIn hinaus)
    vi.mock('@apollo/client/link/context', () => ({
      setContext: vi.fn(),
    }));
  });

  it('sollte Benutzername und Passwort Eingabefelder anzeigen', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    expect(screen.getByText('Benutzername')).toBeInTheDocument();
    expect(screen.getByText('Passwort')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('sollte den Login-Button deaktivieren, wenn Benutzername oder Passwort leer sind', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    const loginButton = screen.getByText('Login');
    expect(loginButton).toHaveAttribute('disabled');
  });

  it('sollte den Login-Button aktivieren, wenn Benutzername und Passwort eingegeben wurden', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    const usernameInput = screen.getByLabelText('Benutzername');
    const passwordInput = screen.getByLabelText('Passwort');
    const loginButton = screen.getByText('Login');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(loginButton).not.toHaveAttribute('disabled');
    });
  });

  it('sollte die Login-Mutation auslösen, wenn der Login-Button geklickt wird', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    const usernameInput = screen.getByLabelText('Benutzername');
    const passwordInput = screen.getByLabelText('Passwort');
    const loginButton = screen.getByText('Login');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(loginButton).not.toHaveAttribute('disabled');
    });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(userUtils.setLoggedIn).toHaveBeenCalledWith(
        JSON.stringify({
          jwtTokens: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token'
          },
          clientMutationId: null
        })
      );
    });
  });

  it('sollte das Passwort anzeigen/verbergen, wenn auf das Augen-Icon geklickt wird', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    const passwordInput = screen.getByLabelText('Passwort');

    // Anfangs sollte das Passwort verborgen sein
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Icon zum Anzeigen des Passworts finden und klicken
    const toggleIcon = screen.getByTestId('passwordToggle');
    fireEvent.click(toggleIcon);

    // Nach dem Klick sollte das Passwort sichtbar sein
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('type', 'text');
    });

    // Icon sollte sich geändert haben
    const newToggleIcon = screen.getByTestId('passwordToggle');
    fireEvent.click(newToggleIcon);

    // Nach erneutem Klick sollte das Passwort wieder verborgen sein
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });
});