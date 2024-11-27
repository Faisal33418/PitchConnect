import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import CompanyInfo from '../company-info';
import DocumentUpload from '../document-upload';
import VideoImage from '../video-image';

const EntrepreneurBusiness = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchTxt, setSearchTxt] = useState(null);
    const getUser = JSON.parse(localStorage.getItem('user'));

    const toggleAccordion = (index) => {
        // If the clicked accordion is already open, close it.
        if (activeIndex === index) {
            setActiveIndex(null);
        } else {
            setActiveIndex(index);
        }
    };

    return (
        <div className="w-full mx-auto p-10 pt-6">
            <form className='mb-10 sticky top-20'>
                <div className="flex border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif] justify-center">
                    <input type="text" onChange={(e) => setSearchTxt(e.target.value)} placeholder={`Search by pitchTitle ${getUser?.role === 'Admin' ? 'or entrepreneur email' : ''}...`}
                        className="w-full outline-none bg-white text-gray-600 text-md px-4 py-3" />
                    <button type='button' onClick={() => { }} className="flex items-center justify-center bg-[#007bff] px-5 text-sm text-white">
                        Search
                    </button>
                </div>
            </form>

            {/* Accordion for CompanyInfo */}
            <div className="border-b border-gray-300">
                <button
                    className="w-full flex justify-between items-center text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    onClick={() => toggleAccordion(0)}
                >
                    <span>Company Info</span>
                    {activeIndex === 0 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </button>
                {activeIndex === 0 && (
                    <div className="p-4 w-[80vw] mx-auto">
                        <CompanyInfo searchingTxt={searchTxt} />
                    </div>
                )}
            </div>

            {/* Accordion for DocumentUpload */}
            <div className="border-b border-gray-300">
                <button
                    className="w-full flex justify-between items-center text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    onClick={() => toggleAccordion(1)}
                >
                    <span>Document Upload</span>
                    {activeIndex === 1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </button>
                {activeIndex === 1 && (
                    <div className="p-4 mx-auto">
                        <DocumentUpload searchingTxt={searchTxt} />
                    </div>
                )}
            </div>

            {/* Accordion for VideoImage */}
            <div className="border-b border-gray-300">
                <button
                    className="w-full flex justify-between items-center text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    onClick={() => toggleAccordion(2)}
                >
                    <span>Video/Image</span>
                    {activeIndex === 2 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </button>
                {activeIndex === 2 && (
                    <div className="p-4 mx-auto">
                        <VideoImage searchingTxt={searchTxt} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EntrepreneurBusiness;
