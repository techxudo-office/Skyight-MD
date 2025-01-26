import React from 'react';
import { CardLayoutContainer, CardLayoutHeader, CardLayoutBody, CardLayoutFooter } from '../../components/CardLayout/CardLayout';
import { MdEditSquare } from "react-icons/md";

const Profile = () => {
    return (
        <>
            <div className="flex flex-col w-full items-center justify-center">
                <CardLayoutContainer className='w-full mb-5'>
                    <CardLayoutHeader className='flex items-center justify-start flex-wrap gap-5 py-3' removeBorder={true}>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjUuYcnZ-xqlGZiDZvuUy_iLx3Nj6LSaZSzQ&s"
                            alt="profile-img"
                            className='rounded-full h-16 w-16 me-3'
                        />
                        <div>
                            <h3 className='text-lg text-text font-semibold'>Profile Name</h3>
                            <h4 className='mb-0 text-sm text-text'>Admin</h4>
                            <h4 className='mb-0 text-sm text-text'>Karachi, Pakistan</h4>
                        </div>
                    </CardLayoutHeader>
                </CardLayoutContainer>
                <CardLayoutContainer className='w-full mb-5'>
                    <CardLayoutHeader className='flex items-center justify-between gap-5 py-3' removeBorder={true}>
                        <h2 className='text-2xl font-semibold text-text'>Persnoal Information</h2>
                        <MdEditSquare className='text-xl text-primary transition-all hover:text-secondary cursor-pointer' />
                    </CardLayoutHeader>
                    <CardLayoutBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-7">
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">First Name</h4>
                                <p className="text-md text-text font-semibold">Profile Name</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">Last Name</h4>
                                <p className="text-md text-text font-semibold">Profile Name</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">Date Of Birth</h4>
                                <p className="text-md text-text font-semibold">28-11-2024</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">Email Address</h4>
                                <p className="text-md text-text font-semibold">profile.user@gmail.com</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">Phone Number</h4>
                                <p className="text-md text-text font-semibold">(+00) 001002003004</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">User Role</h4>
                                <p className="text-md text-text font-semibold">Admin</p>
                            </div>
                        </div>
                    </CardLayoutBody>
                </CardLayoutContainer>
                <CardLayoutContainer className='w-full'>
                    <CardLayoutHeader className='flex items-center justify-between gap-5 py-3' removeBorder={true}>
                        <h2 className='text-2xl font-semibold text-text'>Address</h2>
                        <MdEditSquare className='text-xl text-primary transition-all hover:text-secondary cursor-pointer' />
                    </CardLayoutHeader>
                    <CardLayoutBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-7">
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">Country</h4>
                                <p className="text-md text-text font-semibold">United Kingdom</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">City</h4>
                                <p className="text-md text-text font-semibold">Los Angeles, California</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <h4 className="text-xs mb-1 font-medium text-slate-500">Postal Code</h4>
                                <p className="text-md text-text font-semibold">PTC 0204</p>
                            </div>
                        </div>
                    </CardLayoutBody>
                </CardLayoutContainer>
            </div>
        </>
    );
};

export default Profile;
