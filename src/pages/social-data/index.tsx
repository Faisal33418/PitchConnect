import { useEffect, useState } from "react";
import axios from "axios";
import { DonationTable } from "../../components/donationTable/DonationTable";
function DonationHistoryPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/prosperity/history"
        );
        console.log(response);
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DonationTable donations={donations} />
    </div>
  );
}

export default DonationHistoryPage;
