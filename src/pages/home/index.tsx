import SignUp from "@/components/auth/sign-up";
import Navbar from "@/layout/nav-bar";
import { useEffect } from "react";
import LandingPage from "./landing";

const HomePage = () => {
  const signUp = localStorage.getItem("signup");
  useEffect(() => {
    localStorage.removeItem("signup");
  }, []);

  return (
    <>
      <Navbar />
      {signUp === "true" ? <SignUp /> : <LandingPage />}
      {/* <div>homepage</div> */}
    </>
  );
};

export default HomePage;
