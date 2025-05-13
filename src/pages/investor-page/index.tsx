import React from "react";
import Link from "next/link";
import { NotificationsActive } from "@mui/icons-material";
import { Testimonials } from "@/components/testimonials/Testimonials";
import Stories from "@/components/Stories/Stories";

const InvestorUI = ({ user, showApprovalMessage, toggleApprovalMessage }) => {
  return (
    <>
      <section
        style={{
          background:
            "url(https://proactiveadvisormagazine.com/wp-content/uploads/2023/10/v40-i5-Header-Insights-1920px.jpg), linear-gradient(to right, #AC9C8D, #AC9C8D)",
          backgroundBlendMode: "overlay",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        className="text-black min-h-screen flex justify-center items-center overflow-hidden py-32 relative bg-gradient-to-r from-[#efe9e1] via-[#d8ccc0] to-[#ac9c8d]"
      >
        {/* Animated Shapes */}
        <div className="h-full w-full absolute left-0 overflow-hidden top-0">
          <div className="bg-teal-400 h-64 rounded-full w-64 -left-16 -top-16 absolute animate-float opacity-20"></div>
          <div className="bg-emerald-400 h-48 rounded-full w-48 absolute animate-float-reverse opacity-20 right-32 top-32"></div>
          <div className="bg-green-400 h-32 rounded-full w-32 absolute animate-float bottom-16 left-48 opacity-20"></div>
        </div>

        <div>
          <div className="text-center">
            <h1 className="text-4xl font-bold leading-tight text-black lg:text-6xl mb-6 uppercase">
              Discover the Next Big Thing.
            </h1>
            <p className="text-lg lg:text-xl max-w-[90%] text-black mb-8 mx-auto">
              Explore innovative startups that are shaping the future across
              industries like tech, healthcare, fintech, and sustainability.
              Analyze pitches, place bids, and help turn game-changing ideas
              into reality. Join a growing community of investors who have
              already funded 200+ ideas and found meaningful returns — both
              financial and impact-driven.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full py-16 lg:py-24 bg-gradient-to-br from-[#F6F8F9] to-[#E8F4F0]">
        <div className="container w-[90%] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl font-bold leading-tight lg:text-6xl mb-6 uppercase">
                Discover the Next Big Thing.
              </h1>
              <p className="text-lg lg:text-xl max-w-[90%] mb-8">
                Explore innovative startups that are shaping the future across
                industries like tech, healthcare, fintech, and sustainability.
                Analyze pitches, place bids, and help turn game-changing ideas
                into reality. Join a growing community of investors who have
                already funded 200+ ideas and found meaningful returns — both
                financial and impact-driven.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/entrepreneur-business"
                  className="px-8 py-3 bg-[#0F5233] text-white rounded-lg hover:bg-[#0C4630] transition-colors duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  Browse Pitches
                </Link>
                <button className="px-8 py-3 border-2 border-[#0F5233] text-[#0F5233] rounded-lg hover:bg-[#0F5233]/10 transition-colors duration-300 font-medium">
                  Learn How It Works
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="/iinvestor.jpg"
                  alt="Investor analyzing startup pitches"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex flex-wrap gap-6">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-3xl font-bold">200+</p>
                      <p className="text-sm">Ideas Funded</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-3xl font-bold">$42M</p>
                      <p className="text-sm">Total Investments</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-3xl font-bold">3.2x</p>
                      <p className="text-sm">Avg. ROI</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden lg:block">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#0F5233] flex items-center justify-center text-white font-bold mr-3">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-sm text-gray-500">Angel Investor</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Found two unicorns through this platform. The quality of
                  deals here is unmatched."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Testimonials />
      <Stories />
    </>
  );
};

export default InvestorUI;
