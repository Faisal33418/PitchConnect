import React from "react";
import Link from "next/link";
import { NotificationsActive } from "@mui/icons-material";
import { Testimonials } from "@/components/testimonials/Testimonials";
import Stories from "@/components/Stories/Stories";
import Footer from "../home/footer";

const EntrepreneurUI = ({
  user,
  showApprovalMessage,
  toggleApprovalMessage,
}) => {
  return (
    <>
      <section
        style={{
          background:
            "url(/entrepreneur.jpg), linear-gradient(to right, #AC9C8D, #AC9C8D)",
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
            <h1 className="text-4xl font-bold leading-tight text-black lg:text-6xl mb-6">
              Pitch Your Vision. Inspire the Future
            </h1>
            <p className="text-lg lg:text-xl max-w-[90%] text-black mb-8 mx-auto">
              Launch your startup journey by sharing your unique idea with a
              vibrant network of forward-thinking investors. Whether you're
              building the next tech unicorn or solving a real-world problem,
              this is your stage. Craft your pitch, tell your story, and let
              your innovation speak. Over 100 entrepreneurs have already secured
              funding — you could be next.
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
                Fuel Your Vision.
              </h1>
              <p className="text-lg lg:text-xl max-w-[90%] mb-8">
                Connect with investors who believe in your potential. Showcase
                your innovative ideas to a network of 500+ active investors
                looking for groundbreaking opportunities. Our platform has
                helped entrepreneurs raise over $42M in funding, with 70% of
                pitches receiving investment within 90 days. Take your startup
                to the next level with the right partners and resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create-pitch"
                  className="px-8 py-3 bg-[#0F5233] text-white rounded-lg hover:bg-[#0C4630] transition-colors duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  Create Your Pitch
                </Link>
                <button className="px-8 py-3 border-2 border-[#0F5233] text-[#0F5233] rounded-lg hover:bg-[#0F5233]/10 transition-colors duration-300 font-medium">
                  Pitch Guide
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="/entrepreneu1.jpg"
                  alt="Entrepreneur presenting business idea"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex flex-wrap gap-6">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-3xl font-bold">70%</p>
                      <p className="text-sm">Funding Success Rate</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-3xl font-bold">500+</p>
                      <p className="text-sm">Active Investors</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-3xl font-bold">90 Days</p>
                      <p className="text-sm">Avg. Time to Funding</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden lg:block">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#0F5233] flex items-center justify-center text-white font-bold mr-3">
                    AS
                  </div>
                  <div>
                    <p className="font-semibold">Alex Smith</p>
                    <p className="text-sm text-gray-500">Founder, GreenTech</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Secured $2M funding in just 6 weeks. The investor network
                  here is incredible."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Testimonials />
      <Stories />
      <Footer />
    </>
  );
};

export default EntrepreneurUI;
