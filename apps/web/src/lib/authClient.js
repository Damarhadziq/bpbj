import { createAuthClient } from "better-auth/react"

const authBaseUrl = import.meta.env.VITE_AUTH_BASE_URL || `${window.location.protocol}//${window.location.hostname}:4000`;

export const authClient = createAuthClient({
    baseURL: authBaseUrl
})

export const { signIn, signUp, signOut, useSession } = authClient;
