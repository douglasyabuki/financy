import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLError, print } from "graphql";
import { useAuthStore } from "../../stores/auth";
import { REFRESH_TOKEN } from "./mutations/refresh-token";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const getNewToken = async () => {
  const token = useAuthStore.getState().refreshToken;
  if (!token) throw new Error("No refresh token");

  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: print(REFRESH_TOKEN),
        variables: {
          data: {
            refreshToken: token,
          },
        },
      }),
    });

    const { data, errors } = await response.json();

    if (errors || !data?.refreshToken) {
      useAuthStore.getState().logout();
      throw new Error("Unable to refresh token");
    }

    const { token: newToken, refreshToken: newRefreshToken } =
      data.refreshToken;

    useAuthStore.getState().setTokens(newToken, newRefreshToken);
    return newToken;
  } catch (error) {
    useAuthStore.getState().logout();
    throw error;
  }
};

const errorLink = onError(
  ({
    graphQLErrors,
    operation,
    forward,
  }: {
    graphQLErrors?: ReadonlyArray<GraphQLError>;
    operation: ApolloLink.Operation;
    forward: (op: ApolloLink.Operation) => Observable<any>;
  }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.message === "Unauthenticated") {
          return new Observable((observer) => {
            getNewToken()
              .then((accessToken) => {
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${accessToken}`,
                  },
                });

                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };

                forward(operation).subscribe(subscriber);
              })
              .catch((error) => {
                observer.error(error);
              });
          });
        }
      }
    }
  },
);

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
