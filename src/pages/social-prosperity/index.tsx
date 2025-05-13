import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
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

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDonationAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setDonationAmount(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted organization:", organizationDetails);
    setShowModal(false);
    setOrganizationDetails({ name: "", description: "", image: "" });
  };

  const openDonationModal = (org) => {
    setSelectedOrganization(org);
    setShowDonationModal(true);
  };

  const donateAmount = async () => {
    if (!donationAmount || isNaN(parseFloat(donationAmount))) {
      alert("Please enter a valid donation amount");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/prosperity/donate`,
        {
          name: selectedOrganization.name,
          description: selectedOrganization.description,
          amount: parseFloat(donationAmount),
          user,
        }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Donation error:", error);
      alert("Failed to initiate donation. Please try again.");
    }
  };
  // useEffect(()=>{
  //   toast.success("Donation Successfully:")
  // })

  return (
    <div className="min-h-screen w-full bg-[#efe9e1] p-6">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-[#3a3630] mb-4">
          Social Proprietary
        </h1>
        <p className="text-[#3a3630]/80 text-lg">
          Every year, 10% of your earnings will be automatically allocated to
          social contributions. Please choose the organizations you wish to
          support:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {organizations.map((org, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-[#ac9c8d]/50"
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
              <button
                onClick={() => openDonationModal(org)}
                className="mt-4 bg-[#ac9c8d] text-[#3a3630] px-4 py-2 rounded hover:bg-[#8a7c6f] hover:text-white transition-all"
              >
                Donate
              </button>
            </div>
          </div>
        ))}

        {/* Others Card */}
        <div
          className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-[#ac9c8d]/50 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <div className="w-full h-48 bg-[#efe9e1] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-[#ac9c8d]"
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
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#3a3630] mb-2">
              Others
            </h2>
            <p className="text-[#3a3630]/80">
              Donate to an organization not listed here
            </p>
            <button className="mt-4 bg-[#ac9c8d] text-[#3a3630] px-4 py-2 rounded hover:bg-[#8a7c6f] hover:text-white transition-all">
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
            <form>
              <div className="mb-4">
                <label className="block text-[#3a3630] mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={organizationDetails.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#ac9c8d] rounded focus:outline-none focus:ring-1 focus:ring-[#ac9c8d]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#3a3630] mb-2">Description</label>
                <textarea
                  name="description"
                  value={organizationDetails.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#ac9c8d] rounded focus:outline-none focus:ring-1 focus:ring-[#ac9c8d]"
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
                  className="w-full px-3 py-2 border border-[#ac9c8d] rounded focus:outline-none focus:ring-1 focus:ring-[#ac9c8d]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-[#3a3630] hover:text-[#8a7c6f]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSelectedOrganization(organizationDetails);
                    setShowModal(false);
                    setShowDonationModal(true);
                  }}
                  type="button"
                  className="px-4 py-2 bg-[#ac9c8d] text-[#3a3630] rounded hover:bg-[#8a7c6f] hover:text-white transition-all"
                >
                  Continue to Donate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donation Amount Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#3a3630] mb-2">
              Donate to {selectedOrganization?.name}
            </h2>
            <p className="text-[#3a3630]/80 mb-6">
              {selectedOrganization?.description}
            </p>

            <div className="mb-6">
              <label className="block text-[#3a3630] mb-2">
                Donation Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3a3630]">
                  $
                </span>
                <input
                  type="text"
                  value={donationAmount}
                  onChange={handleDonationAmountChange}
                  placeholder="0.00"
                  className="w-full pl-8 px-3 py-2 border border-[#ac9c8d] rounded focus:outline-none focus:ring-1 focus:ring-[#ac9c8d]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDonationModal(false);
                  setDonationAmount("");
                }}
                className="px-4 py-2 text-[#3a3630] hover:text-[#8a7c6f]"
              >
                Cancel
              </button>
              <button
                onClick={donateAmount}
                className="px-4 py-2 bg-[#ac9c8d] text-[#3a3630] rounded hover:bg-[#8a7c6f] hover:text-white transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
