import { Providers } from "@/app/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import "@aws-amplify/ui-react/styles.css";
import { ApplicationLayout } from "@/app/application-layout";
import ConfigureAmplifyClientSide from "@/config/configure-amplify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bedrock Driven OpenSearch",
  description: `Leverage AWS Bedrock and OpenSearch for intelligent, natural language-powered search.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        <Providers>
          <ApplicationLayout>{children}</ApplicationLayout>
        </Providers>
      </body>
    </html>
  );
}
