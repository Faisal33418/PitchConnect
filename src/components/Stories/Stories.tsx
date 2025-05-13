import React from "react";

export default function Stories() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 md:px-8 lg:px-16 overflow-hidden relative">
      {/* Background Circle */}
      <div className="absolute right-0 top-0 w-3/4 h-full">
        <div className="bg-blue-100 rounded-full w-full h-full transform translate-x-1/3 -translate-y-1/4 opacity-50"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <div className="max-w-md">
              <span className="text-orange-500 font-medium text-sm uppercase tracking-wider">
                SUCCESS STORIES
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mt-2 mb-4">
                We have Stories to inspire you
              </h2>
              <p className="text-gray-600 mb-8">
                Over years, businesses have trusted us for the agility, neatness
                and the robustness we promise and deliver
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full transition duration-300">
                Read All Stories
              </button>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-white rounded-xl shadow-md p-4 transform translate-x-0 lg:-translate-x-8">
                <img
                  src="https://media.istockphoto.com/id/1264156957/photo/young-man-in-the-city-reaching-his-goals.jpg?s=612x612&w=0&k=20&c=-xtXMjc8CecrJWLkETw6yk6-yVhswh7w1_uh5ele820="
                  alt="Office desk with computer"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <span className="text-green-500 text-xs font-medium uppercase tracking-wider">
                  Web Development
                </span>
                <h3 className="text-gray-800 font-medium mt-2 mb-2">
                  Creating an interactive game
                </h3>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl shadow-md p-4 transform translate-y-6">
                <img
                  src="https://thumbs.dreamstime.com/b/success-future-concept-businessman-abstract-office-interior-background-sunlight-copy-space-success-future-113441145.jpg"
                  alt="Office desk with computer"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <span className="text-green-500 text-xs font-medium uppercase tracking-wider">
                  Marketing
                </span>
                <h3 className="text-gray-800 font-medium mt-2 mb-2">
                  We can change the way you market your product in market
                </h3>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl shadow-md p-4 col-span-2 transform translate-y-4 lg:translate-x-8">
                <div className="flex items-start">
                  <div className="w-2/3 pr-4">
                    <span className="text-green-500 text-xs font-medium uppercase tracking-wider">
                      Mobile App
                    </span>
                    <h3 className="text-gray-800 font-medium mt-2">
                      Bringing an app with millions of users into the market
                    </h3>
                  </div>
                  <div className="w-1/3">
                    <img
                      src="https://thumbs.dreamstime.com/b/success-business-man-raise-his-hand-double-exposure-concept-businessman-city-51559957.jpg"
                      alt="Plant on desk"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
