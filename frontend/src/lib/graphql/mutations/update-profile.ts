import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: UpdateUserInput!) {
    updateProfile(data: $data) {
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`;
