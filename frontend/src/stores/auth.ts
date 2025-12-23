import { env } from "@/env";
import { LOGIN } from "@/lib/graphql/mutations/login";
import { REFRESH_TOKEN } from "@/lib/graphql/mutations/refresh-token";
import { REGISTER } from "@/lib/graphql/mutations/register";
import { UPDATE_PROFILE } from "@/lib/graphql/mutations/update-profile";
import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  User,
} from "@/types";
import { ApolloClient } from "@apollo/client";
import { print } from "graphql";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RegisterMutationData = {
  register: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type LoginMutationData = {
  login: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type UpdateProfileMutationData = {
  updateProfile: {
    user: User;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  signup: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  updateProfile: (data: UpdateProfileInput) => Promise<boolean>;
  logout: () => void;
  setTokens: (token: string, refreshToken: string) => void;
  checkAuth: (silent?: boolean) => Promise<void>;
  refreshSession: () => Promise<string | null>;
  client: ApolloClient | null;
  setClient: (client: ApolloClient) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      client: null,
      setClient: (client) => set({ client }),
      refreshSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return null;
        }

        try {
          const response = await fetch(env.VITE_BACKEND_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: print(REFRESH_TOKEN),
              variables: {
                data: {
                  refreshToken: refreshToken,
                },
              },
            }),
          });

          const { data, errors } = await response.json();

          if (errors || !data?.refreshToken) {
            get().logout();
            return null;
          }

          const { token: newToken, refreshToken: newRefreshToken } =
            data.refreshToken;
          set({ token: newToken, refreshToken: newRefreshToken });
          return newToken;
        } catch (error) {
          get().logout();
          return null;
        }
      },
      checkAuth: async (silent = false) => {
        if (!silent) set({ isCheckingAuth: true });
        const { token, refreshToken } = get();
        if (!token || !refreshToken) {
          if (!silent) set({ isCheckingAuth: false });
          return;
        }

        try {
          const decoded: { exp: number } = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          const buffer = 300; // 5 minutes

          if (decoded.exp < currentTime + buffer) {
            await get().refreshSession();
          }
        } catch (error) {
          get().logout();
        } finally {
          if (!silent) set({ isCheckingAuth: false });
        }
      },
      setTokens: (token: string, refreshToken: string) =>
        set({ token, refreshToken }),
      login: async (loginData: LoginInput) => {
        try {
          const client = get().client;
          if (!client) {
            throw new Error("Apollo Client not initialized");
          }
          const { data } = await client.mutate<
            LoginMutationData,
            { data: LoginInput }
          >({
            mutation: LOGIN,
            variables: {
              data: {
                email: loginData.email,
                password: loginData.password,
              },
            },
          });

          if (data?.login) {
            const { user, token, refreshToken } = data.login;
            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
              token,
              refreshToken,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.log("Error logging in");
          throw error;
        }
      },
      signup: async (registerData: RegisterInput) => {
        try {
          const client = get().client;
          if (!client) {
            throw new Error("Apollo Client not initialized");
          }
          const { data } = await client.mutate<
            RegisterMutationData,
            { data: RegisterInput }
          >({
            mutation: REGISTER,
            variables: {
              data: {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
              },
            },
          });
          if (data?.register) {
            const { token, user, refreshToken } = data.register;
            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
              token,
              refreshToken,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.log("Error signing up");
          throw error;
        }
      },
      updateProfile: async (profileData: UpdateProfileInput) => {
        try {
          const client = get().client;
          if (!client) {
            throw new Error("Apollo Client not initialized");
          }
          const { data } = await client.mutate<
            UpdateProfileMutationData,
            { data: { name: string } }
          >({
            mutation: UPDATE_PROFILE,
            variables: {
              data: {
                name: profileData.name,
              },
            },
          });
          if (data?.updateProfile) {
            const { user } = data.updateProfile;
            set((state) => ({
              user: state.user
                ? {
                    ...state.user,
                    name: user.name,
                    updatedAt: user.updatedAt,
                  }
                : null,
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.log("Error updating profile");
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        get().client?.clearStore();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
