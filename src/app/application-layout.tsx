"use client";

import { signOut } from "aws-amplify/auth";
import { Avatar } from "@/components/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/dropdown";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/sidebar";
import { SidebarLayout } from "@/components/sidebar-layout";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { HomeIcon, Square2StackIcon } from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import { useListCollections } from "@/hooks/use-list-collections";

function AccountDropdownMenu({
  anchor,
}: {
  anchor: "top start" | "bottom end";
}) {
  async function handleSignOut() {
    await signOut();
  }

  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={handleSignOut}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  const pathname = usePathname();
  const { data: collections } = useListCollections();

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <UserCircleIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem href="/">
              <SidebarLabel>Bedrock Lens</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === "/"}>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              {collections && collections.length > 0 && (
                <SidebarItem
                  href="/collections"
                  current={pathname.startsWith("/collections")}
                >
                  <Square2StackIcon />
                  <SidebarLabel>Collections</SidebarLabel>
                </SidebarItem>
              )}
            </SidebarSection>
            {collections && collections.length > 0 && (
              <SidebarSection className="max-lg:hidden">
                <SidebarHeading>Collections</SidebarHeading>
                {collections?.map((collection) => (
                  <SidebarItem
                    key={collection.slug}
                    href={`/collections/${collection.slug}`}
                  >
                    {collection.name}
                  </SidebarItem>
                ))}
              </SidebarSection>
            )}
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-10 bg-orange-300" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white capitalize">
                      {auth?.name}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {auth?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
