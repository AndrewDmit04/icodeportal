"use client";
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Image from 'next/image';
import { DeleteUser, verifyUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import VerifiedAccountForm from '../forms/VerifiedAccountForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
interface Params {
  first: string;
  last: string;
  img: string;
  uid: string;
  role: string;
  OID : string;
  location : string;
  locations: { id: string; name: string }[];
  setRefresh : any;
}

const UnVerifiedAccount = ({ first, last, img, uid, role, OID,location,locations, setRefresh }: Params) => {
  const [isSalaryPopupOpen, setIsSalaryPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [salary, setSalary] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(role);
  const [selectedLocation, setSelectedLocation] = useState<string>(location);
  const handleAcceptClick = () => {
    setIsSalaryPopupOpen(true);
  };

  const handleCloseSalaryPopup = () => {
    setIsSalaryPopupOpen(false);
    setSalary(0); // Reset the form
  };

  const handleFormSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const numericSalary = typeof salary === 'string' ? parseFloat(salary) : salary;
    await verifyUser({OID : OID, IID : uid, sal : numericSalary, role :selectedOption, location : selectedLocation })
    console.log(`Salary for ${first} ${last}: ${salary}`);
    setRefresh((prev : any) => !prev)
    setIsSalaryPopupOpen(false); 
    
  };
  
  const handelLocationChange = (option: string) => {
    setSelectedLocation(option);
  }
  const handleRadioChange = (option: string) => {
    setSelectedOption(option);
    };

  const handleDenyClick = () => {
    setIsDeletePopupOpen(true);
  };

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log(`User ${first} ${last} has been deleted.`);
    DeleteUser({OID : OID, IID : uid})
    setIsDeletePopupOpen(false); 
    redirect('/staff');
  };

  return (
    <div>
    <Card className="w-64 transform transition-all duration-300">
      <CardContent className="p-6 flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25"></div>
          <Image
            className="relative rounded-full border-2 border-white shadow-md"
            src={img}
            alt={`${first} ${last}`}
            width={80}
            height={80}
          />
        </div>

        <div className="text-center space-y-2">
          <h2 className="font-semibold text-lg text-gray-800">
            {first} {last}
          </h2>
          <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {role}
          </p>
        </div>

        <div className="flex gap-2 w-full pt-2">
          <Button
            onClick={handleAcceptClick}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm"
          >
            Accept
          </Button>
          <Button
            onClick={handleDenyClick}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm"
          >
            Deny
          </Button>
        </div>
      </CardContent>
      </Card>

      {/* Salary Popup */}
      {isSalaryPopupOpen && (
        <VerifiedAccountForm 
            first={first} 
            salary={salary} 
            setSalary={setSalary} 
            selectedOption={selectedOption}
            handleRadioChange={handleRadioChange}
            handleCloseSalaryPopup={handleCloseSalaryPopup}
            handleFormSubmit={handleFormSubmit}
            selectedLocation={selectedLocation}
            handleLocationHange={handelLocationChange}
            locations={locations}
            />
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-4">Do you really want to delete {first} {last}? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button className="bg-gray-500 hover:bg-gray-700" onClick={handleCloseDeletePopup}>Cancel</Button>
              <Button className="bg-red-500 hover:bg-red-700" onClick={handleConfirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    
    </div>
  );

};

export default UnVerifiedAccount;
