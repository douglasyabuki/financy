import { ApolloLink, Observable } from "@apollo/client";
// @ts-ignore
import { extractFiles } from "extract-files";
import { print } from "graphql";

export const createUploadLink = (options: {
  uri: string;
  headers?: Record<string, string>;
  includeExtensions?: boolean;
}) => {
  return new ApolloLink((operation) => {
    return new Observable((observer) => {
      const { uri } = options;
      const { operationName, extensions, variables, query } = operation;
      const context = operation.getContext();

      const fetchOptions = {
        method: "POST",
        headers: {
          ...(options.headers || {}),
          ...context.headers,
        },
      };

      const operationPayload = {
        operationName,
        variables,
        query: print(query),
        extensions: options.includeExtensions ? extensions : undefined,
      };

      const { clone, files } = extractFiles(operationPayload);

      let body: BodyInit | null | undefined;

      if (files.size) {
        // Multipart
        const formData = new FormData();
        formData.append("operations", JSON.stringify(clone));

        const map: Record<string, string[]> = {};
        let i = 0;
        files.forEach((paths: string[]) => {
          map[i++] = paths;
        });
        formData.append("map", JSON.stringify(map));

        i = 0;
        files.forEach((_: string[], file: Blob) => {
          formData.append(i.toString(), file);
          i++;
        });

        body = formData;

        // Let the browser set the Content-Type for FormData
        // Explicitly removing it if it was set in headers (e.g. by auth middleware often setting application/json)
        if (fetchOptions.headers["Content-Type"]) {
          delete fetchOptions.headers["Content-Type"];
        }
        if (fetchOptions.headers["content-type"]) {
          delete fetchOptions.headers["content-type"];
        }
      } else {
        body = JSON.stringify(operationPayload);
        if (
          !fetchOptions.headers["Content-Type"] &&
          !fetchOptions.headers["content-type"]
        ) {
          fetchOptions.headers["Content-Type"] = "application/json";
        }
      }

      fetch(uri, {
        ...fetchOptions,
        body,
      })
        .then((response) => {
          operation.setContext({ response });
          if (response.status >= 300) {
            return response.text().then((text) => {
              try {
                const json = JSON.parse(text);
                // Handle GraphQL errors
                if (json && (json.errors || json.data)) return json;
                throw new Error(
                  `Network error: ${response.status} ${response.statusText}`,
                );
              } catch (e) {
                throw new Error(
                  `Network error: ${response.status} ${response.statusText}`,
                );
              }
            });
          }
          return response.json();
        })
        .then((result) => {
          observer.next(result);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  });
};
