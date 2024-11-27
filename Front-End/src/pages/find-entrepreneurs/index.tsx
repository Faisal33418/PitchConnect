import React, { useState, useEffect } from 'react';
import APIs from '@/utils/api-handler';
import { PlayCircleOutline, DownloadOutlined } from '@mui/icons-material'; // MUI Icons
import { Modal } from '@mui/material'; // Modal from MUI

const FindEntrepreneurs = () => {
    const [entrepreneurs, setEntrepreneurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredVideoId, setHoveredVideoId] = useState(null); // For play icon on hover
    const placeholderImage = '/find-entrepreneur/no-media-found.png';

    useEffect(() => {
        const fetchEntrepreneurs = async () => {
            const token = localStorage.getItem('token');
            const endPoint = 'entrepreneur/find';
            const headers = { Authorization: `Bearer ${token}` };

            const apiResponse = await APIs(endPoint, null, 'GET', headers, null, false);
            if (apiResponse?.status === 200) {
                setEntrepreneurs(apiResponse.data.data);
            } else {
                console.error('Failed to fetch entrepreneurs');
            }
        };
        fetchEntrepreneurs();
    }, []);

    const filteredCompanies = entrepreneurs
        .flatMap((entrepreneur) => entrepreneur.companies.map((company) => ({
            ...company,
            entrepreneurName: entrepreneur.fullName,
            entrepreneurEmail: entrepreneur.email,
            entrepreneurProfilePicture: entrepreneur.profilePicture,
        })))
        .filter((company) => company.pitchTitle?.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleOpenModal = (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="container mx-auto px-6 py-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Find Your Entrepreneur</h2>

            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    placeholder="Search by Business Title"
                    className="border border-gray-300 rounded-lg p-3 w-full max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Companies List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCompanies.map((company) => (
                    <div key={company._id} className="bg-white rounded-lg shadow-md p-6">
                        <div
                            className="relative group"
                            onMouseEnter={() => setHoveredVideoId(company.videoImages[0]?._id)}
                            onMouseLeave={() => setHoveredVideoId(null)}
                        >
                            <img
                                src={
                                    company.videoImages[0]?.logoBanner[0]
                                        ? `${process.env.NEXT_PUBLIC_HOSTNAME}${company.videoImages[0]?.logoBanner[0]}`
                                        : placeholderImage
                                }
                                alt="Banner"
                                className="h-48 w-full object-cover rounded-lg"
                            />
                            {hoveredVideoId === company.videoImages[0]?._id && (
                                <PlayCircleOutline
                                    fontSize="large"
                                    className="absolute inset-0 m-auto text-white opacity-80 group-hover:opacity-100 cursor-pointer"
                                    onClick={() =>
                                        company.videoImages[0] && window.open(
                                            `${process.env.NEXT_PUBLIC_HOSTNAME}${company.videoImages[0]?.video[0]}`,
                                            '_blank'
                                        )
                                    }
                                />
                            )}
                        </div>

                        {/* Company Info */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">{company.pitchTitle || 'No Title'}</h3>
                            <p className="text-gray-600">{company.shortSummary || 'No summary available'}</p>
                            <p className="font-bold text-green-500">
                                Investment Range: {company.investmentRange || 'N/A'}
                            </p>
                            <button
                                className="mt-2 text-blue-500 flex items-center"
                                onClick={() => handleOpenModal(company)}
                            >
                                Read More <PlayCircleOutline className="ml-2" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Company Details */}
            {selectedCompany && (
                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <div className="bg-white p-8 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">{selectedCompany.pitchTitle}</h2>
                        <p><strong>Entrepreneur:</strong> {selectedCompany.entrepreneurName}</p>
                        <p><strong>Email:</strong> {selectedCompany.entrepreneurEmail}</p>
                        <p><strong>Summary:</strong> {selectedCompany.shortSummary || 'N/A'}</p>
                        <p><strong>Investment Range:</strong> {selectedCompany.investmentRange || 'N/A'}</p>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Documents</h3>
                            {selectedCompany.documents?.length > 0 ? (
                                selectedCompany.documents.map((doc) => (
                                    <div key={doc._id} className="flex items-center gap-2 mt-2">
                                        {doc.documents.map((file) => (
                                            <div key={file} className="relative group flex">
                                                <span className="flex gap-2">
                                                    <a
                                                        href={`${process.env.NEXT_PUBLIC_HOSTNAME}${file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500"
                                                    >
                                                        {file.split('.').pop().toUpperCase()} Document
                                                    </a>
                                                    <DownloadOutlined
                                                        className="text-gray-400 group-hover:text-blue-500 cursor-pointer"
                                                        onClick={() =>
                                                            window.open(
                                                                `${process.env.NEXT_PUBLIC_HOSTNAME}${file}`,
                                                                '_blank'
                                                            )
                                                        }
                                                    />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p>No documents available</p>
                            )}
                        </div>
                        <center>
                            <button
                                className="mt-4 w-24 bg-red-500 text-white py-2 rounded"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </center>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default FindEntrepreneurs;
