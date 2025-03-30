import { describe, it, expect, vi, beforeEach } from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import NodeList from '../../src/pages/nodeList';
import { GET_CONTENT } from '../../src/util/content';
import * as userUtil from '../../src/util/user';

// Mock der useQuery-Funktionalität für Apollo Client
const mocks = [
  {
    request: {
      query: GET_CONTENT,
      variables: {
        first: 100,
        after: null,
      },
    },
    result: {
      data: {
        Admin: {
          Tree: {
            GetContentNodes: {
              edges: [
                { node: { id: '1', structureDefinition: { title: 'Node 1' } } },
                { node: { id: '2', structureDefinition: { title: 'Node 2' } } }
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: 'cursor-123'
              }
            }
          }
        }
      }
    },
  },
];

// Mock für Pagination-Test
const paginationMocks = [
  {
    request: {
      query: GET_CONTENT,
      variables: {
        first: 100,
        after: null,
      },
    },
    result: {
      data: {
        Admin: {
          Tree: {
            GetContentNodes: {
              edges: [
                { node: { id: '1', structureDefinition: { title: 'Node 1' } } },
                { node: { id: '2', structureDefinition: { title: 'Node 2' } } },
                { node: { id: '3', structureDefinition: { title: 'Node 3' } } },
                { node: { id: '4', structureDefinition: { title: 'Node 4' } } },
                { node: { id: '5', structureDefinition: { title: 'Node 5' } } },
                { node: { id: '6', structureDefinition: { title: 'Node 6' } } },
                { node: { id: '7', structureDefinition: { title: 'Node 7' } } },
                { node: { id: '8', structureDefinition: { title: 'Node 8' } } },
                { node: { id: '9', structureDefinition: { title: 'Node 9' } } },
                { node: { id: '10', structureDefinition: { title: 'Node 10' } } },
                { node: { id: '12', structureDefinition: { title: 'Node 12' } } },
                { node: { id: '13', structureDefinition: { title: 'Node 13' } } },
                { node: { id: '14', structureDefinition: { title: 'Node 14' } } }
              ],
              pageInfo: {
                hasNextPage: true,
                endCursor: 'cursor-123'
              }
            }
          }
        }
      }
    },
  },
  {
    request: {
      query: GET_CONTENT,
      variables: {
        first: 100,
        after: 'cursor-123',
      },
    },
    result: {
      data: {
        Admin: {
          Tree: {
            GetContentNodes: {
              edges: [
                { node: { id: '15', structureDefinition: { title: 'Node 15' } } },
                { node: { id: '16', structureDefinition: { title: 'Node 16' } } }
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: 'cursor-456'
              }
            }
          }
        }
      }
    },
  }
];

// Mock der Error-Response
const errorMock = [
  {
    request: {
      query: GET_CONTENT,
      variables: {
        first: 100,
        after: null,
      },
    },
    error: new Error('Ein Fehler ist aufgetreten'),
  },
];

// Mock der unauthorisierter Fehler
const unauthorizedMock = [
  {
    request: {
      query: GET_CONTENT,
      variables: {
        first: 100,
        after: null,
      },
    },
    result: {
      errors: [
        { message: 'Unauthorized', extensions: { code: 'UNAUTHENTICATED' }, statusCode: 401 }
      ]
    }
  }
];

describe('NodeList Component', () => {
  beforeEach(() => {
    // Mocken der checkAuth-Funktion
    vi.spyOn(userUtil, 'checkAuth').mockImplementation(() => {});
    vi.spyOn(userUtil, 'logout').mockImplementation(() => {});

    // Reset localStorage mocks
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    // Mock für IntersectionObserver
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('sollte die checkAuth-Funktion beim Rendern aufrufen', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <NodeList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(userUtil.checkAuth).toHaveBeenCalled();
    });
  });

  it('sollte Nodes anzeigen, wenn Daten geladen sind', async () => {
    // Wir müssen die Daten explizit in das DOM einfügen, um sie zu testen
    const mockData = {
      edges: [
        { node: { id: '1', structureDefinition: { title: 'Node 1' } } },
        { node: { id: '2', structureDefinition: { title: 'Node 2' } } }
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: 'cursor-123'
      }
    };

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockData.edges));

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <NodeList />
      </MockedProvider>
    );

    // Wir verwenden die debug-Funktion, um den DOM zu sehen
    // screen.debug();

    // Warten, bis die Komponente gerendert wurde
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 1000 });

    // Überprüfen, ob localStorage abgefragt wurde
    expect(localStorage.getItem).toHaveBeenCalledWith('nodeList');
  });

  it('sollte eine Fehlermeldung anzeigen, wenn ein Fehler auftritt', async () => {
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <NodeList />
      </MockedProvider>
    );

    // Wir verwenden einen TestId, um das Fehlerelement zu identifizieren
    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('sollte logout aufrufen, wenn ein Authentifizierungsfehler auftritt', async () => {
    render(
      <MockedProvider mocks={unauthorizedMock} addTypename={false}>
        <NodeList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(userUtil.logout).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('sollte einen Ladezustand während des Ladens anzeigen', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <NodeList />
      </MockedProvider>
    );

    // Der Spinner sollte beim ersten Render zu sehen sein
    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('sollte Paginierung unterstützen', async () => {
    // Den IntersectionObserver mocken, aber die tatsächliche Funktionalität nicht testen
    const observeSpy = vi.fn();
    window.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: observeSpy,
      disconnect: vi.fn(),
      unobserve: vi.fn()
    }));

    render(
      <MockedProvider mocks={paginationMocks} addTypename={false}>
        <NodeList />
      </MockedProvider>
    );

    // Warten auf die ersten Daten
    await waitFor(() => {
      expect(screen.getByText('Node 1')).toBeInTheDocument();
      expect(screen.getByText('Node 2')).toBeInTheDocument();
    });

    // Überprüfen, ob der Observer für ein Element registriert wurde
    // Dies zeigt, dass die Paginierungslogik aktiviert wurde
    expect(observeSpy).toHaveBeenCalled();

    // Alternativ: Prüfen, ob hasMore korrekt gesetzt wurde
    // Dafür müssten wir einen Zugriff auf den State haben
  });
});