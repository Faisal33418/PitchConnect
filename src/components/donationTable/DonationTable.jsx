import React, { useState } from "react";

export const DonationTable = ({ donations }) => {
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    const firstNameInitial = names[0]?.charAt(0) || "";
    const lastNameInitial =
      names.length > 1 ? names[names.length - 1]?.charAt(0) : "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  const openProfileModal = (donor) => {
    setSelectedDonor(donor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Donor Profile Modal */}
      {isModalOpen && selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">
                Donor Profile
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 text-2xl font-medium">
                    {getInitials(selectedDonor.fullName)}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedDonor.fullName}
                  </h4>
                  <p className="text-gray-500">{selectedDonor.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium">{selectedDonor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium">
                    {selectedDonor.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium">
                    {selectedDonor.location || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="text-sm font-medium">
                    {selectedDonor.industry || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Bio</p>
                <p className="text-sm font-medium mt-1">
                  {selectedDonor.Bios || "No bio available"}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Skills</p>
                <p className="text-sm font-medium mt-1">
                  {selectedDonor.skills || "No skills listed"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Donation History
          </h2>
          <p className="text-gray-600 mt-1">All charitable contributions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Donor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Organization
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                {/* <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th> */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr
                  key={donation._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Donor Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => openProfileModal(donation.donor)}
                    >
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {getInitials(donation.donor.fullName)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                          {donation.donor.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {donation.donor.role}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Organization Column */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {donation.organization.name}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {donation.organization.description}
                    </div>
                  </td>

                  {/* Amount Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${donation.amount.toFixed(2)}
                    </div>
                    {donation.donor.bid?.bid_amount && (
                      <div className="text-xs text-gray-500">
                        Bid: ${donation.donor.bid.bid_amount}
                      </div>
                    )}
                  </td>

                  {/* Status Column */}
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        donation.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : donation.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {donation.status.charAt(0).toUpperCase() +
                        donation.status.slice(1)}
                    </span>
                  </td> */}

                  {/* Date Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(donation.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(donation.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {donations.length === 0 && (
          <div className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No donations found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start making donations to see them appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
