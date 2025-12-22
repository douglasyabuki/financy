import { gql } from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData(
    $limit: Float!
    $offset: Float!
    $filters: GetTransactionsFilterInput
  ) {
    balanceSummary {
      balance
      monthIncome
      monthExpense
    }
    categorySummary {
      category {
        id
        title
        color
        icon
      }
      count
      totalAmount
    }
    listTransactions(limit: $limit, offset: $offset, filters: $filters) {
      items {
        id
        description
        date
        amount
        type
        category {
          title
          color
          icon
        }
      }
    }
  }
`;
