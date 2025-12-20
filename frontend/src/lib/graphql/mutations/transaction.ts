import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $data: CreateTransactionInput!
    $categoryId: String!
  ) {
    createTransaction(data: $data, categoryId: $categoryId) {
      id
      description
      amount
      type
      date
      category {
        id
        title
        icon
        color
      }
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      id
      description
      amount
      type
      date
      category {
        id
        title
        icon
        color
      }
    }
  }
`;
