import { gql } from "@apollo/client";

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($data: ForgotPasswordInput!) {
    forgotPassword(data: $data)
  }
`;
