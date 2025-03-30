// TextInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextInput from '../../../src/components/input/text';
import { ApolloError } from '@apollo/client';
import {Fa0} from 'react-icons/fa6';

describe('TextInput Component', () => {
  it('rendert korrekt mit dem angegebenen Hinweis', () => {
    render(<TextInput hint="E-Mail Adresse" update={() => {}} />);
    expect(screen.getByText('E-Mail Adresse')).toBeInTheDocument();
  });

  it('hat standardmäßig einen outlined Stil', () => {
    render(<TextInput update={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border border-solid border-b-gray-600');
  });

  it('zeigt keinen Hinweis an, wenn nicht angegeben', () => {
    render(<TextInput update={() => {}} />);
    // Es gibt kein Label-Element, wenn kein Hint vorhanden ist
    expect(screen.queryByText(/./i)).not.toBeInTheDocument();
  });

  it('ändert die Position des Hinweises, wenn der Input fokussiert ist', () => {
    render(<TextInput hint="Benutzername" update={() => {}} />);

    const input = screen.getByRole('textbox');
    const hintLabel = screen.getByText('Benutzername');

    // Anfangs sollte der Hinweis in der Mitte sein
    expect(hintLabel).toHaveClass('top-1/2 -translate-y-1/2 text-gray-400');

    // Nach Fokussierung sollte der Hinweis nach oben wandern
    fireEvent.focus(input);
    expect(hintLabel).toHaveClass('-top-3 text-sm bg-white text-gray-600');
  });

  it('behält die Position des Hinweises oben, wenn der Input einen Wert hat', () => {
    render(<TextInput hint="Passwort" update={() => {}} />);

    const input = screen.getByRole('textbox');
    const hintLabel = screen.getByText('Passwort');

    // Text eingeben und Fokus verlieren
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'geheim123' } });
    fireEvent.blur(input);

    // Der Hinweis sollte oben bleiben, wenn ein Wert vorhanden ist
    expect(hintLabel).toHaveClass('-top-3 text-sm bg-white text-gray-600');
  });

  it('ruft die update-Funktion mit dem neuen Wert auf', () => {
    const mockUpdate = vi.fn();
    render(<TextInput update={mockUpdate} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'neuer Wert' } });

    expect(mockUpdate).toHaveBeenCalledWith('neuer Wert');
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('zeigt eine Fehlermeldung an, wenn ein Fehler übergeben wird', () => {
    const testError = new ApolloError({
      graphQLErrors: [{ message: 'Ungültige Eingabe' }]
    });

    render(<TextInput hint="Test" update={() => {}} error={testError} />);

    expect(screen.getByText(testError.message)).toBeInTheDocument();
    const errorElement = screen.getByText(testError.message);
    expect(errorElement).toHaveClass('text-red-500');
    expect(errorElement).toHaveClass('text-sm');
  });

  it('fügt keinen Fehlerbereich hinzu, wenn kein Fehler vorhanden ist', () => {
    const { container } = render(<TextInput hint="Test" update={() => {}} />);

    // Es sollte kein Element mit der Klasse 'text-red-500' geben
    expect(container.querySelector('.text-red-500')).not.toBeInTheDocument();
  });

  it('rendert einen Button für prependInnerActionIcon, wenn angegeben', () => {
    const mockAction = vi.fn();
    render(
      <TextInput
        update={() => {}}
        prependInnerActionIcon={{
          icon: <Fa0 data-testid="test"/>,
          action: mockAction
        }}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Finden des Icons mit der Materialicons-Klasse und der vorgegebenen Icon-Klasse
    const icon = screen.getByTestId('test')
    expect(button.children[0]).equal(icon);
  });

  it('führt die Aktion aus, wenn auf den prependInnerActionIcon-Button geklickt wird', () => {
    const mockAction = vi.fn();
    render(
      <TextInput
        update={() => {}}
        prependInnerActionIcon={{
          icon: 'clear',
          action: mockAction
        }}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('gibt zusätzliche props an das Input-Element weiter', () => {
    render(
      <TextInput
        update={() => {}}
        placeholder="Geben Sie Ihren Text ein"
        maxLength={50}
        data-testid="custom-input"
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('placeholder', 'Geben Sie Ihren Text ein');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('wendet outlined Stil nicht an, wenn outlined=false gesetzt ist', () => {
    render(<TextInput update={() => {}} outlined={false} />);

    const input = screen.getByRole('textbox');
    expect(input).not.toHaveClass('border border-solid border-b-gray-600');
  });
});