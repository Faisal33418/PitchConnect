import { useEffect, useState } from "react";

export default function ContractsList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:8080/api/contracts/by-email?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setContracts(data.contracts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch contracts", err);
        setLoading(false);
      });
  }, [user?.email]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-center text-3xl font-semibold mb-6">
        Contracts for{" "}
        <span className="text-[#B2A394] font-bold underline">
          {user?.fullName}
        </span>
      </h2>
      <ul className="space-y-4">
        {contracts.map((contract) => (
          <li
            key={contract._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <p className="text-lg font-bold">{contract.contractName}</p>
            <p className="text-sm text-gray-600 capitalize">
              Type: {contract.userType}
            </p>
            <p className="my-2 mb-4 text-gray-800">Terms: {contract.terms}</p>

            {contract.filePath && (
              <a
                href={`http://localhost:8080/${contract.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="p-2 text-white my-3 rounded-md mt-5"
                style={{
                  background: "#AF9F91",
                }}
              >
                Download Contract
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
