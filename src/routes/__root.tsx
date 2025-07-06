/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/tanstack-react-start";
import { ChartColumnBigIcon } from "lucide-react";
import { Toaster } from "sonner";

import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
//import { createServerFn } from "@tanstack/react-start";
import * as React from "react";
//import { getAuth } from "@clerk/tanstack-react-start/server";
//import { getWebRequest } from "@tanstack/react-start/server";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary.js";
import { NotFound } from "@/components/NotFound.js";
import appCss from "@/styles/app.css?url";
import { Button } from "@/components/ui/button";
import poppins100 from "@fontsource/poppins/100.css?url";
import poppins200 from "@fontsource/poppins/200.css?url";
import poppins300 from "@fontsource/poppins/300.css?url";
import poppins400 from "@fontsource/poppins/400.css?url";
import poppins500 from "@fontsource/poppins/500.css?url";
import poppins600 from "@fontsource/poppins/600.css?url";

import { getSignedInUserId } from "@/data/getSignedInUserId";

// const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
//   const { userId } = await getAuth(getWebRequest()!);

//   return {
//     userId,
//   };
// });

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: poppins100 },
      { rel: "stylesheet", href: poppins200 },
      { rel: "stylesheet", href: poppins300 },
      { rel: "stylesheet", href: poppins400 },
      { rel: "stylesheet", href: poppins500 },
      { rel: "stylesheet", href: poppins600 },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  beforeLoad: async () => {
    const { userId } = await getSignedInUserId();

    return {
      userId,
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <ClerkProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ClerkProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="bg-primary p-4 h-20 text-white flex items-center justify-between">
          <Link to="/" className="flex gap-1 items-center font-bold text-2xl">
            <ChartColumnBigIcon className="text-lime-500" /> TanTracker
          </Link>
          <SignedOut>
            <div className="text-white flex items-center">
              <Button asChild variant="link" className="text-white">
                <SignInButton />
              </Button>
              <div className="w-[1px] h-8 bg-zinc-700" />
              <Button asChild variant="link" className="text-white">
                <SignUpButton />
              </Button>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton
              showName
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    border: "1px solid white",
                  },
                  userButtonOuterIdentifier: {
                    color: "white",
                  },
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Dashboard"
                  labelIcon={<ChartColumnBigIcon size={16} />}
                  onClick={() => {
                    navigate({
                      to: "/dashboard",
                    });
                  }}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </nav>
        {children}
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />

        <Scripts />
      </body>
    </html>
  );
}
