import "@/styles/globals.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Layout from "@/layout/layout";
import SignIn from "@/components/auth/sign-in";
import Loading from "@/components/loading";
import { AppProvider } from "@/context/AppProvider";

export default function App({ Component, pageProps }: AppProps) {
  const [isLogin, setIsLogin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loginStatus = localStorage.getItem("token");
    setIsLogin(loginStatus);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
