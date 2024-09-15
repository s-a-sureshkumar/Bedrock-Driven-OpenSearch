"use client";
import { fetchAuthSession } from "aws-amplify/auth";
import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  sub: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  auth: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchAuthSession()
      .then((sessionData) => {
        const email = sessionData.tokens?.idToken?.payload?.email as string;
        const name = `${sessionData.tokens?.idToken?.payload.given_name} ${sessionData.tokens?.idToken?.payload.family_name}`;
        setAuth({
          sub: sessionData.tokens?.idToken?.payload.sub ?? "",
          email: email,
          name: name,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
