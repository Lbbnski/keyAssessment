import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Node from '../../src/components/node';

describe('Node Component', () => {
  it('sollte den Titel korrekt darstellen', () => {
    const testTitle = 'Test Node Title';
    render(<Node title={testTitle} />);
    
    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });

  it('sollte die richtige CSS-Klasse haben', () => {
    const testTitle = 'Test Node Title';
    const { container } = render(<Node title={testTitle} />);
    
    const nodeElement = container.firstChild;
    expect(nodeElement).toHaveClass('bg-white');
    expect(nodeElement).toHaveClass('p-4');
    expect(nodeElement).toHaveClass('rounded-lg');
    expect(nodeElement).toHaveClass('shadow-md');
    expect(nodeElement).toHaveClass('mx-auto');
  });

  it('sollte ein optionales stretch Prop akzeptieren', () => {
    const testTitle = 'Test Node Title';
    render(<Node title={testTitle} stretch={true} />);
    
    // Hinweis: In der aktuellen Implementierung wird das stretch-Prop nicht verwendet,
    // daher prüfen wir nur, dass die Komponente ohne Fehler rendert
    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });
});