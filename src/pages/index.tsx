import { useEffect, useState } from "react";
import SignUp from "../components/auth/sign-up";
import HeroSection from "../components/hero";
import AdminUI from "./admin-ui";
import InvestorUI from "./investor-page";
import EntrepreneurUI from "./enrepreneur-page";
import LandingPage from "./landing";

export default function Home() {
  const [isLogin, setIsLogin] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loginStatus = localStorage.getItem("login");
    const my_user = JSON.parse(localStorage.getItem("user"));
    setUser(my_user);
    console.log(my_user);
    setIsLogin(loginStatus);
  }, []);

  return (
    <div className="flex w-full flex-col">
      {/* Rendering default page */}
      {/* <HeroSection /> */}
      {!user && <LandingPage />}
      {user?.role == "Admin" && <AdminUI />}
      {user?.role == "Investor" && <InvestorUI />}
      {user?.role == "Entrepreneur" && <EntrepreneurUI />}
      {/* {isLogin == "true" && <SignUp />} */}
    </div>
  );
}
