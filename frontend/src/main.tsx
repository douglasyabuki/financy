import { ApolloProvider } from "@apollo/client/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
import "./index.css";
import { apolloClient } from "./lib/graphql/apollo.ts";

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
);
