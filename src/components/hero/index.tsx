import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Chat,
  DocumentScanner,
  NotificationsActive,
} from "@mui/icons-material";
import ApprovalStatus from "./Status";
import axios from "axios";
import { Testimonials } from "../testimonials/Testimonials";
import Stories from "../Stories/Stories";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  HeartIcon,
  ScaleIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
const HeroSection = () => {
  const [user, setUser] = useState(null);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    setUser(getUser);
  }, []);

  const toggleApprovalMessage = () => {
    setShowApprovalMessage(!showApprovalMessage);
  };

  return <></>;
};

export default HeroSection;
