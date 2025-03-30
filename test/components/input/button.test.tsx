// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../../../src/components/input/button';

// Mock für den Spinner erstellen
vi.mock('../spinner.tsx', () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

describe('Button Component', () => {
  it('rendert korrekt mit dem angegebenen Titel', () => {
    render(<Button title="Klick mich" />);
    expect(screen.getByRole('button')).toHaveTextContent('Klick mich');
  });

  it('ist deaktiviert, wenn disabled prop true ist', () => {
    render(<Button title="Deaktiviert" disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('ist standardmäßig aktiviert', () => {
    render(<Button title="Aktiviert" />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('ruft onClick Handler auf, wenn geklickt wird', () => {
    const handleClick = vi.fn();
    render(<Button title="Klick mich" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('zeigt keinen Spinner, wenn loading false ist', () => {
    render(<Button title="Laden" loading={false} />);
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('zeigt einen Spinner, wenn loading true ist', () => {
    const { container } = render(<Button title="Laden" loading={true} />);
    const button = screen.getByRole('button');
    expect(button.children.length).toBeGreaterThan(0);
    expect(container.querySelector('button > *')).toBeInTheDocument();
  });

  it('gibt zusätzliche props an das Button-Element weiter', () => {
    const testId = 'custom-button';
    const className = 'test-class';
    render(<Button title="Test" data-testid={testId} className={className} />);
    const button = screen.getByTestId(testId);
    expect(button).toBeInTheDocument();
    expect(button.className).toContain(className);
  });
});