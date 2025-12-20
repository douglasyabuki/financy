import { apolloClient } from "@/lib/graphql/apollo";
import { LOGIN } from "@/lib/graphql/mutations/login";
import { REGISTER } from "@/lib/graphql/mutations/register";
import { UPDATE_PROFILE } from "@/lib/graphql/mutations/update-profile";
import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  User,
} from "@/types";
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
  signup: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  updateProfile: (data: UpdateProfileInput) => Promise<boolean>;
  logout: () => void;
  setTokens: (token: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setTokens: (token: string, refreshToken: string) =>
        set({ token, refreshToken }),
      login: async (loginData: LoginInput) => {
        try {
          const { data } = await apolloClient.mutate<
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
          const { data } = await apolloClient.mutate<
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
          const { data } = await apolloClient.mutate<
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
        apolloClient.clearStore();
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
