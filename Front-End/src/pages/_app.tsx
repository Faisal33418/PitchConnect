import "@/styles/globals.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Layout from "@/layout/layout";
import SignIn from "@/components/auth/sign-in";
import Loading from "@/components/loading";
import HomePage from "./home";

export default function App({ Component, pageProps }: AppProps) {
  const [isLogin, setIsLogin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage only on the client side
    const loginStatus = localStorage.getItem("token");
    setIsLogin(loginStatus);
    setIsLoading(false); // Indicate that loading is complete
  }, []);

  if (isLoading) {
    // Optionally return a loading spinner or empty content until localStorage is checked
    return <Loading />
  }

  return (
    isLogin ? (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    ) : (
      <HomePage />
      // <SignIn />
    )
  );
}
