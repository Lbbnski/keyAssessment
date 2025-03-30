import { gql } from '@apollo/client';

export const GET_CONTENT = gql`
    query getContent($first: Int, $after: String) {
        Admin {
            Tree {
                GetContentNodes(first: $first, after: $after) {
                    edges {
                        node {
                            id
                            structureDefinition {
                                title
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        }
    }
`;