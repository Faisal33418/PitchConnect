import React, { useState, useEffect } from 'react';
import APIs from '@/utils/api-handler';
import { PlayCircleOutline, DownloadOutlined } from '@mui/icons-material'; // MUI Icons

import { Modal } from '@mui/material'; // You can replace this with any modal

const FindEntrepreneurs = () => {
    const [entrepreneurs, setEntrepreneurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredVideoId, setHoveredVideoId] = useState(null); // For play icon on hover

    useEffect(() => {
        const fetchEntrepreneurs = async () => {
            const token = localStorage.getItem('token');
            let getUser = JSON.parse(localStorage.getItem('user'));

            const endPoint = 'entrepreneur/find';
            const headers = { 'Authorization': `Bearer ${token}` };

            const apiResponse = await APIs(endPoint, null, 'GET', headers, null, false);
            if (apiResponse?.status === 200) {
                setEntrepreneurs(apiResponse.data.data);
            } else {
                console.error('Failed to fetch entrepreneurs');
            }
        };
        fetchEntrepreneurs();
    }, []);

    const filteredEntrepreneurs = entrepreneurs.filter((entrepreneur) =>
        entrepreneur.companies.some((company) =>
            company.pitchTitle.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleOpenModal = (entrepreneur) => {
        setSelectedEntrepreneur(entrepreneur);
        setIsModalOpen(true);
    };

    console.log({ entrepreneurs });
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

            {/* Entrepreneurs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEntrepreneurs.map((entrepreneur) => (
                    entrepreneur.videoImages.map((videoImage, index) => (
                        <div key={videoImage._id} className="bg-white rounded-lg shadow-md p-6">
                            <div
                                className="relative group"
                                onMouseEnter={() => setHoveredVideoId(videoImage._id)}
                                onMouseLeave={() => setHoveredVideoId(null)}
                            >
                                <img
                                    // src={videoImage.logoBanner[0]}
                                    src={`${process.env.NEXT_PUBLIC_HOSTNAME}${videoImage.logoBanner[0]}`}
                                    alt="Banner"
                                    className="h-48 w-full object-cover rounded-lg"
                                />
                                {hoveredVideoId === videoImage._id && (
                                    <PlayCircleOutline
                                        fontSize='large'
                                        className="absolute inset-0 m-auto text-white opacity-80 group-hover:opacity-100 cursor-pointer"
                                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_HOSTNAME}${videoImage.video[0]}`, '_blank')}
                                    />
                                )}
                            </div>

                            {/* Entrepreneur Info */}
                            {/* {entrepreneur.companies.map((company) => ( */}
                                <div key={entrepreneur?.companies[index]._id} className="mt-4">
                                    <h3 className="text-lg font-semibold">{entrepreneur?.companies[index].pitchTitle}</h3>
                                    <p className="text-gray-600">{entrepreneur?.companies[index].shortSummary}</p>
                                    <p className="font-bold text-green-500">
                                        Investment Range: {entrepreneur?.companies[index].investmentRange}
                                    </p>

                                    <button
                                        className="mt-2 text-blue-500 flex items-center"
                                        onClick={() => handleOpenModal(entrepreneur)}
                                    >
                                        Read More <PlayCircleOutline className="ml-2" />
                                    </button>
                                </div>
                            {/* ))} */}
                        </div>
                    ))
                ))}
            </div>

            {/* Modal for Entrepreneur Details */}
            {selectedEntrepreneur && (
                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <div className="bg-white p-8 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">{selectedEntrepreneur.fullName}</h2>
                        <img
                            src={`${process.env.NEXT_PUBLIC_HOSTNAME}${selectedEntrepreneur.profilePicture[0]}`}
                            alt="Profile"
                            className="h-32 w-32 object-cover rounded-full mx-auto mb-4"
                        />
                        <p><strong>Email:</strong> {selectedEntrepreneur.email}</p>
                        <p><strong>Phone:</strong> {selectedEntrepreneur.phoneNumber}</p>
                        <p><strong>Location:</strong> {selectedEntrepreneur.location}</p>
                        <p><strong>Industry:</strong> {selectedEntrepreneur.industry}</p>
                        <p><strong>Bios:</strong> {selectedEntrepreneur.Bios}</p>
                        <p><strong>Skills:</strong> {selectedEntrepreneur.skills}</p>

                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Documents</h3>
                            {selectedEntrepreneur.documents.map((doc) => (
                                <div key={doc._id} className="flex items-center gap-2 mt-2">
                                    {doc.documents.map((file) => (
                                        <div key={file} className="relative group flex">
                                            <span className='flex gap-2'>
                                                <a
                                                    href={file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500"
                                                >
                                                    {file.split('.').pop().toUpperCase()} Document
                                                </a>
                                                <DownloadOutlined
                                                    className=" right-0 text-gray-400 group-hover:text-blue-500 cursor-pointer"
                                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_HOSTNAME}${file}`, '_blank')}
                                                />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
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
