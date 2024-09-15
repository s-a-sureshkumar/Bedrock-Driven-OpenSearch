"use client";
import { AuthProvider } from "@/contexts/auth-context";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { reactQueryClient } from "@/config/react-query-client";
import { Authenticator } from "@aws-amplify/ui-react";

const Providers = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => {
  return (
    <Authenticator variation="modal">
      <AuthProvider>
        <QueryClientProvider client={reactQueryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </Authenticator>
  );
};

export { Providers };
