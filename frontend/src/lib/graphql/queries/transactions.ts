import { gql } from "@apollo/client";

export const LIST_TRANSACTIONS = gql`
  query ListTransactions(
    $limit: Float
    $offset: Float
    $filters: GetTransactionsFilterInput
  ) {
    listTransactions(limit: $limit, offset: $offset, filters: $filters) {
      items {
        id
        description
        date
        type
        amount
        categoryId
        category {
          id
          title
          description
          icon
          color
        }
      }
      totalCount
    }
  }
`;
