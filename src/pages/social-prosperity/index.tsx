import React, { useState } from "react";

const organizations = [
  {
    name: "Green Earth Fund",
    description: "Environmental sustainability projects.",
    image:
      "https://media.istockphoto.com/id/1489061272/photo/crystal-earth-on-ferns-in-green-grass-forest-with-sunlight-environment-save-the-world-earth.jpg?s=612x612&w=0&k=20&c=WVbWtdV-FrGafT5SsilWOTT8nd8_2x5EiAp8gn7jS4k=",
  },
  {
    name: "EduBridge Foundation",
    description: "Education for underprivileged kids.",
    image:
      "https://www.lecole.edu.pk/wp-content/uploads/2021/01/Education-Pic.jpg",
  },
  {
    name: "Health4All",
    description: "Medical help in rural areas.",
    image:
      "https://hbr.org/resources/images/article_assets/2019/10/Oct19_22_1032609198.jpg",
  },
  {
    name: "CleanWater Initiative",
    description: "Clean water for everyone.",
    image: "https://cdn.hswstatic.com/gif/water-update.jpg",
  },
  {
    name: "TechLift",
    description: "Empowering youth with tech education.",
    image:
      "https://imageio.forbes.com/specials-images/imageserve/61d52d4e3a76ed81ac034ea8/The-10-Tech-Trends-That-Will-Transform-Our-World/960x0.jpg?height=399&width=711&fit=bounds",
  },
];

export default function SocialProprietaryScreen() {
  const [showModal, setShowModal] = useState(false);
  const [organizationDetails, setOrganizationDetails] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganizationDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Submitted organization:", organizationDetails);
    setShowModal(false);
    setOrganizationDetails({ name: "", description: "", image: "" });
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f1eb] p-6">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-[#3a3630] mb-4">
          Social Proprietary
        </h1>
        <p className="text-[#3a3630]/90 text-lg">
          Every year, 10% of your earnings will be automatically allocated to
          social contributions. Please choose the organizations you wish to
          support:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {organizations.map((org, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-[#d1c7bc]"
          >
            <img
              src={org.image}
              alt={org.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#3a3630] mb-2">
                {org.name}
              </h2>
              <p className="text-[#3a3630]/80">{org.description}</p>
              <button className="mt-4 bg-[#AE9F90] text-white px-4 py-2 rounded hover:bg-[#8a7c6f] transition-all">
                Donate
              </button>
            </div>
          </div>
        ))}

        {/* Others Card - Now properly visible */}
        <div
          className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-[#d1c7bc] cursor-pointer flex flex-col"
          onClick={() => setShowModal(true)}
        >
          <div className="w-full h-48 bg-[#f5f1eb] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-[#AE9F90]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div className="p-6 flex-grow flex flex-col">
            <h2 className="text-xl font-semibold text-[#3a3630] mb-2">
              Others
            </h2>
            <p className="text-[#3a3630]/80 mb-4">
              Donate to an organization not listed here
            </p>
            <button className="mt-auto bg-[#AE9F90] text-white px-4 py-2 rounded hover:bg-[#8a7c6f] transition-all">
              Add Organization
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding new organization */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#3a3630] mb-4">
              Add Your Organization
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#3a3630] mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={organizationDetails.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#d1c7bc] rounded focus:outline-none focus:ring-1 focus:ring-[#AE9F90]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#3a3630] mb-2">Description</label>
                <textarea
                  name="description"
                  value={organizationDetails.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#d1c7bc] rounded focus:outline-none focus:ring-1 focus:ring-[#AE9F90]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#3a3630] mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={organizationDetails.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#d1c7bc] rounded focus:outline-none focus:ring-1 focus:ring-[#AE9F90]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-[#3a3630] hover:text-[#AE9F90]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#AE9F90] text-white rounded hover:bg-[#8a7c6f] transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
