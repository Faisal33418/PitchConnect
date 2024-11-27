import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const HeroSection = () => {
    const [user, setUser] = useState();
    useEffect(() => {
        const getUser = JSON.parse(localStorage.getItem('user'));
        setUser(getUser);
    }, []);

    return (
        user?.role === 'Admin' ? <section className="bg-gradient-to-r from-blue-500 text-white py-20">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
                        <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-4">
                            ADMIN PANEL: MANAGE USERS OPERATIONS EFFICIENTLY.
                        </h1>
                        <p className="text-lg mb-6">
                            GAIN INSIGHTS, CONTROL ACCESS, AND STREAMLINE WORKFLOWS FOR OPTIMAL PERFORMANCE.
                        </p>
                    </div>

                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 flex justify-center py-16">
                        <Image
                            src={"/dashboard/admin.png"}
                            alt="Admin Dashboard Overview"
                            width={900}
                            height={900}
                            className="w-full max-w-md"
                        />
                    </div>
                </div>
            </div>
        </section> : <section className="bg-gradient-to-r from-green-400 border text-white py-20">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
                        {user?.role === 'Entrepreneur' ? <>
                            <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-4">
                                EMPOWERING ENTREPRENEURS TO TURN INNOVATIVE IDEAS INTO REALITY.
                            </h1>
                            <p className="text-lg mb-6">
                                CONNECT WITH INVESTORS, PITCH YOUR VISION, AND TAKE THE NEXT STEP TOWARD SUCCESS.
                            </p>
                        </> : <>
                            <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-4 uppercase">
                                Discover startups, invest smartly, and shape the future.
                            </h1>
                            <p className="text-lg mb-6">
                                CONNECT WITH ENTREPRENEURS, EVALUATE THEIR VISIONS, AND DRIVE THE FUTURE OF SUCCESSFUL INNOVATIONS.
                            </p>
                        </>}
                        <div className="flex space-x-4">
                            <Link
                                href={
                                    user?.role === 'Entrepreneur'
                                        ? '/entrepreneur-business'
                                        : user?.role === 'Investor'
                                            ? '/find-entrepreneurs'
                                            : '/entrepreneur-business'
                                }
                            >
                                <button className="bg-white text-green-600 py-2 px-4 rounded shadow-lg hover:bg-gray-200 transition duration-300">
                                    Start Your Journey
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 py-16 flex justify-center">
                        <Image
                            src={"/dashboard/image.svg"}
                            alt="Entrepreneurs and Investors"
                            width={900}
                            height={900}
                            className="w-full max-w-md"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
