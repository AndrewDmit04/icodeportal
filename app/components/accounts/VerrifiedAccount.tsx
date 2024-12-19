"use client"
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Image from 'next/image';
import { DeleteUser, verifyUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import VerifiedAccountForm from '../forms/VerifiedAccountForm';

interface Params {
  first: string;
  last: string;
  img: string;
  uid: string;
  role: string;
  pay: number;
  OID : string
}

const VerifiedAccount = ({ first, last, img, uid, role, pay, OID }: Params) => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [salary, setSalary] = useState<number>(pay);
  const [selectedOption, setSelectedOption] = useState<string | null>(role);

  const handleEditClick = () => {
    setIsEditPopupOpen(true);
  };

  const handleCloseSalaryPopup = () => {
    setIsEditPopupOpen(false);
    setSalary(0); // Reset the form
  };

  const handleFormSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const numericSalary = typeof salary === 'string' ? parseFloat(salary) : salary;
    await verifyUser({OID : OID, IID : uid, sal : numericSalary, role :selectedOption })
    console.log(`Salary for ${first} ${last}: ${salary}`);
    setIsEditPopupOpen(false); 
    redirect('/staff');
  };
  

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
    <div className="flex flex-col bg-slate-100 w-40 items-center rounded-md p-2 shadow-lg transition-all border-2 border-neutral-700" key={uid}>
      <Image className="rounded-full mb-2" src={img} alt="Profile" width={50} height={50} />
      <h1 className="text-center">{first} {last}</h1>
      <p className="text-gray-500">{role}</p>
      <p className="text-green-300">${pay}/h</p>
      <div className="flex gap-1">
        <Button onClick={handleEditClick}>Edit</Button>
        <Button className="bg-red-500 hover:bg-red-800" onClick={handleDenyClick}>Delete</Button>
      </div>

      {/* Edit Popup */}
      {isEditPopupOpen && (
          <VerifiedAccountForm 
                first={first} 
                salary={salary} 
                setSalary={setSalary} 
                selectedOption={selectedOption}
                handleRadioChange={handleRadioChange}
                handleCloseSalaryPopup={handleCloseSalaryPopup}
                handleFormSubmit={handleFormSubmit}
                />
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-4">Do you really want to delete {first} {last}? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button className="bg-gray-500 hover:bg-gray-700" onClick={() => setIsDeletePopupOpen(false)}>Cancel</Button>
              <Button className="bg-red-500 hover:bg-red-700" onClick={handleConfirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedAccount;
