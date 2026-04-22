import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
const AUTH_SESSION_KEY = "auth_session";

const decodeJwtPayload = (token) => {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const jsonPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

const resolveTokenExpiry = (token, fallbackExpiry) => {
    if (fallbackExpiry) {
        return fallbackExpiry;
    }

    const payload = decodeJwtPayload(token);
    if (!payload?.exp) {
        return null;
    }

    return new Date(payload.exp * 1000).toISOString();
};

const isExpired = (token, expiresAt) => {
    if (!token) return true;

    const resolvedExpiry = resolveTokenExpiry(token, expiresAt);
    if (!resolvedExpiry) return false;

    return new Date(resolvedExpiry) <= new Date();
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearSession = () => {
        setUser(null);
        setToken(null);
        setExpiresAt(null);
        localStorage.removeItem(AUTH_SESSION_KEY);
    };

    useEffect(() => {
        const rawSession = localStorage.getItem(AUTH_SESSION_KEY);
        if (rawSession) {
            try {
                const parsedSession = JSON.parse(rawSession);
                const sessionToken = parsedSession?.token;
                const sessionExpiry = parsedSession?.expiresAt;
                const sessionUser = parsedSession?.user;

                if (
                    sessionToken &&
                    sessionUser &&
                    !isExpired(sessionToken, sessionExpiry)
                ) {
                    setUser(sessionUser);
                    setToken(sessionToken);
                    setExpiresAt(
                        resolveTokenExpiry(sessionToken, sessionExpiry),
                    );
                } else {
                    clearSession();
                }
            } catch {
                clearSession();
            }
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!token) {
            return undefined;
        }

        const sessionWatcher = window.setInterval(() => {
            if (isExpired(token, expiresAt)) {
                clearSession();
            }
        }, 30000);

        return () => window.clearInterval(sessionWatcher);
    }, [token, expiresAt]);

    const login = (authData) => {
        const normalizedUser = {
            id: authData.id,
            username: authData.username,
            email: authData.email,
            fullName: authData.fullName,
            role: authData.role,
            profileId: authData.profileId,
        };

        const normalizedToken = authData.token;
        const normalizedExpiry = resolveTokenExpiry(
            normalizedToken,
            authData.expiresAt,
        );

        const session = {
            user: normalizedUser,
            token: normalizedToken,
            expiresAt: normalizedExpiry,
        };

        setUser(normalizedUser);
        setToken(normalizedToken);
        setExpiresAt(normalizedExpiry);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    };

    const logout = () => {
        clearSession();
    };

    const isAuthenticated = !!user && !!token && !isExpired(token, expiresAt);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                expiresAt,
                login,
                logout,
                loading,
                isAuthenticated,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
