import { useEffect, useState } from "react";
import SignUp from "../components/auth/sign-up";
import HeroSection from "../components/hero";

export default function Home() {
  const [isLogin, setIsLogin] = useState<string | null>(null);
  useEffect(() => {
    // Check localStorage only on the client side
    const loginStatus = localStorage.getItem("login");
    setIsLogin(loginStatus);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Rendering default page */}
      <HeroSection />
      {/* {isLogin == "true" && <SignUp />} */}
    </div>
  )
}
