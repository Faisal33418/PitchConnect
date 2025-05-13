import React from "react";
import { DocumentScanner, Chat } from "@mui/icons-material";
import {
  CheckCircleIcon,
  HeartIcon,
  ScaleIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

const FullAdminUI = () => {
  return (
    <>
      <section className="min-h-screen flex justify-center items-center overflow-hidden py-32 relative bg-gradient-to-r from-[#efe9e1] via-[#d8ccc0] to-[#ac9c8d]">
        {/* Animated Shapes */}
        <div className="h-full w-full absolute left-0 overflow-hidden top-0">
          <div className="bg-purple-500 h-64 rounded-full w-64 -left-16 -top-16 absolute animate-float opacity-20"></div>
          <div className="bg-blue-500 h-48 rounded-full w-48 absolute animate-float-reverse opacity-20 right-32 top-32"></div>
          <div className="bg-indigo-500 h-32 rounded-full w-32 absolute animate-float bottom-16 left-48 opacity-20"></div>
        </div>

        <div className="container lg:px-8 mx-auto px-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="text">
              <h1 className="text-4xl font-bold leading-tight lg:text-6xl mb-6">
                Manage. Monitor. Empower Growth.
              </h1>
              <p className="text-lg lg:text-xl max-w-[90%] mb-8 ">
                Gain full control of the platform with access to powerful
                management tools. Approve and monitor pitches, oversee investor
                activity, handle user support, and maintain the health of the
                ecosystem. Your role ensures that the connection between great
                minds and wise investors thrives smoothly and securely.
              </p>
            </div>
            <img src="/admin.png" alt="Admin" width={"100%"} />
          </div>
        </div>
      </section>
      <div className="bg-[#efe9e1]">
        {/* Hero Header */}
        {/* <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#efe9e1] to-[#d8ccc0]">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#3a3630] mb-6">
              Admin <span className="text-[#ac9c8d]">Power Tools</span>
            </h1>
            <p className="text-xl text-[#5a534a] max-w-3xl mx-auto">
              Advanced systems to curate and optimize the platform experience
            </p>
          </div>
        </div> */}

        {/* Featured Ideas Section */}
        {/* <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#d8ccc0]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-[#ac9c8d]/20 mr-4">
                  <SparklesIcon className="w-8 h-8 text-[#ac9c8d]" />
                </div>
                <h2 className="text-3xl font-bold text-[#3a3630]">
                  Featured Ideas
                </h2>
              </div>
              <p className="text-[#5a534a] text-lg">
                Spotlight exceptional pitches with our AI-powered curation
                system that surfaces the most promising startups for investor
                attention.
              </p>
              <ul className="space-y-3 text-[#5a534a]">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-[#ac9c8d] mt-0.5 mr-3 flex-shrink-0" />
                  <span>Automated quality scoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-[#ac9c8d] mt-0.5 mr-3 flex-shrink-0" />
                  <span>Investor engagement analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-[#ac9c8d] mt-0.5 mr-3 flex-shrink-0" />
                  <span>Customizable spotlight rotations</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#d8ccc0] h-96">
              <img
                src="https://www.videoengager.com/wp-content/uploads/2024/04/features-2.jpg"
                alt="Featured ideas dashboard"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a3630]/20 to-transparent"></div>
            </div>
          </div>
        </section> */}

        {/* Contract Management Section */}
        {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d8ccc0]/50 border-t border-[#d8ccc0]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative rounded-xl overflow-hidden shadow-2xl border border-[#d8ccc0] h-96">
              <img
                src="https://img.forconstructionpros.com/files/base/acbm/fcp/image/2020/01/Contract_istock_gettyimages_000003390628.5e1caf1a488a0.png?auto=format%2Ccompress&fit=max&q=70&rect=0%2C84%2C1920%2C1080&w=1200"
                alt="Contract management interface"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a3630]/20 to-transparent"></div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-[#ac9c8d]/20 mr-4">
                  <DocumentScanner className="w-8 h-8 text-[#ac9c8d]" />
                </div>
                <h2 className="text-3xl font-bold text-[#3a3630]">
                  Contract Management
                </h2>
              </div>
              <p className="text-[#5a534a] text-lg">
                Streamline deal execution with our secure, transparent contract
                workflow system that reduces administrative overhead by 65%.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#d8ccc0] p-4 rounded-lg">
                  <div className="text-2xl font-bold text-[#ac9c8d]">98%</div>
                  <div className="text-sm text-[#5a534a]">Completion Rate</div>
                </div>
                <div className="bg-[#d8ccc0] p-4 rounded-lg">
                  <div className="text-2xl font-bold text-[#ac9c8d]">3.2x</div>
                  <div className="text-sm text-[#5a534a]">Faster Deals</div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Social Prosperity Section */}
        {/* <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#d8ccc0]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-[#ac9c8d]/20 mr-4">
                  <HeartIcon className="w-8 h-8 text-[#ac9c8d]" />
                </div>
                <h2 className="text-3xl font-bold text-[#3a3630]">
                  Social Prosperity
                </h2>
              </div>
              <p className="text-[#5a534a] text-lg">
                Promote and track startups creating meaningful social and
                economic impact through our comprehensive impact measurement
                framework.
              </p>
              <div className="flex space-x-4">
                <div className="flex-1 bg-[#d8ccc0] p-4 rounded-lg">
                  <div className="flex items-center">
                    <ScaleIcon className="h-5 w-5 text-[#ac9c8d] mr-2" />
                    <span className="font-medium text-[#3a3630]">
                      SDG Alignment
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-[#efe9e1] rounded-full">
                    <div className="h-2 bg-[#ac9c8d] rounded-full w-4/5"></div>
                  </div>
                </div>
                <div className="flex-1 bg-[#d8ccc0] p-4 rounded-lg">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-[#ac9c8d] mr-2" />
                    <span className="font-medium text-[#3a3630]">
                      Community Reach
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-[#efe9e1] rounded-full">
                    <div className="h-2 bg-[#ac9c8d] rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#d8ccc0] h-96">
              <img
                src="https://media.istockphoto.com/id/619240046/photo/close-up-man-holding-green-plant-in-hand.jpg?s=612x612&w=0&k=20&c=Ct2eBPsezHRq9Hnu_AzyGa8sjr-52m8qTtkNh6gkrO0="
                alt="Social impact dashboard"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a3630]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-[#ac9c8d]/50 backdrop-blur-sm p-4 rounded-lg">
                  <div className="text-[#3a3630] font-medium">
                    Current Top Project:
                  </div>
                  <div className="text-[#5a534a]">
                    Clean Water Initiative - 92% Impact Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Interpreted Communication Section */}
        {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#d8ccc0]/50 border-t border-b border-[#d8ccc0]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative rounded-xl overflow-hidden shadow-2xl border border-[#d8ccc0] h-96">
              <img
                src="https://media.istockphoto.com/id/495193237/photo/multiethnic-group-of-people-planning-ideas.jpg?s=612x612&w=0&k=20&c=uybWH47wW_DKuzXz5j6FF6yLb8hGzoFv3o-KYSUpfTQ="
                alt="Communication interface"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a3630]/20 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-[#ac9c8d]/50 backdrop-blur-sm px-3 py-1 rounded-full text-[#5a534a] text-sm">
                Live Translation Active
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-[#ac9c8d]/20 mr-4">
                  <Chat className="w-8 h-8 text-[#ac9c8d]" />
                </div>
                <h2 className="text-3xl font-bold text-[#3a3630]">
                  Interpreted Communication
                </h2>
              </div>
              <p className="text-[#5a534a] text-lg">
                Break language barriers with real-time translation supporting 12
                languages and cultural context adaptation for clearer
                negotiations.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  "English",
                  "Spanish",
                  "Mandarin",
                  "Arabic",
                  "French",
                  "Portuguese",
                ].map((lang) => (
                  <div
                    key={lang}
                    className="bg-[#d8ccc0] p-2 rounded text-center text-sm text-[#5a534a]"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        {/* <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#ac9c8d]/40 to-[#9a8c7d]/40">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#3a3630] mb-6">
                Ready to Optimize Your Platform?
              </h2>
              <p className="text-xl text-[#5a534a] mb-8">
                Access the complete suite of admin tools designed to maximize
                engagement and efficiency.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-4 bg-[#ac9c8d] hover:bg-[#9a8c7d] text-white rounded-lg font-bold transition">
                  Launch Admin Dashboard
                </button>
                <button className="px-8 py-4 border border-[#5a534a] hover:border-[#3a3630] text-[#3a3630] rounded-lg font-bold transition">
                  Schedule Training
                </button>
              </div>
            </div>
          </div> */}
      </div>
    </>
  );
};

export default FullAdminUI;
