// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import superjson from "superjson";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { SEO } from "@/components/SEO";
import { useRouter } from "next/router";
import Head from "next/head";
import { Footer } from "@/components/Footer";

type NextPageWithAuthAndLayout = NextPage & {
  hasAuth?: boolean;
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithAuthAndLayout = AppProps & {
  Component: NextPageWithAuthAndLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithAuthAndLayout) => {
  const getLayout = Component.getLayout ?? (page => page);
  const page = getLayout(<Component {...pageProps} />);
  const hasAuth = Component.hasAuth === undefined || Component.hasAuth;
  return (
    <>
      <SEO />
      <Head>
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
      </Head>
      {hasAuth && <Navbar />}
      {hasAuth ? <Auth>{page}</Auth> : page}
      {hasAuth && <Footer />}
    </>
  );
};

const Auth = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isAuthenticated = Boolean(user);
  const isAuthRoute = router.pathname.startsWith("/auth");
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      if (isAuthRoute) return;
      router.replace("/auth/signup");
    }
  }, [isAuthRoute, isAuthenticated, isLoading, router]);

  if (isAuthenticated) return <>{children}</>;
  return null;
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
