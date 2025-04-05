import { useEffect, useState } from "react";
import SignUp from "../components/auth/sign-up";
import HeroSection from "../components/hero";

export default function Home() {
  const [isLogin, setIsLogin] = useState<string | null>(null);
  useEffect(() => {
    const loginStatus = localStorage.getItem("login");
    setIsLogin(loginStatus);
  }, []);

  return (
    <div className="flex w-full flex-col">
      {/* Rendering default page */}
      <HeroSection />
      {/* {isLogin == "true" && <SignUp />} */}
    </div>
  );
}
