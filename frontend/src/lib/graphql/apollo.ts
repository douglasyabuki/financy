import { env } from "@/env";
import { useAuthStore } from "@/stores/auth";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLError } from "graphql";
import { createUploadLink } from "./upload-link";

const uploadLink = createUploadLink({
  uri: env.VITE_BACKEND_URL,
});

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
          console.log(
            "[Apollo] Unauthenticated error caught. Attempting refresh...",
          );
          return new Observable((observer) => {
            useAuthStore
              .getState()
              .refreshSession()
              .then((accessToken) => {
                if (!accessToken) {
                  console.log("[Apollo] Refresh failed. Logout triggered.");
                  observer.error(new Error("Unauthenticated"));
                  return;
                }

                console.log("[Apollo] Token refreshed successfully.");
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
                console.error("[Apollo] Error during token refresh:", error);
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
  link: ApolloLink.from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
});

useAuthStore.getState().setClient(apolloClient);
