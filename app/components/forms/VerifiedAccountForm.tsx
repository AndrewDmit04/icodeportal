import { Button } from '@/components/ui/button'
import React, { FormEventHandler, MouseEventHandler } from 'react'

interface Params{
    first : string;
    salary : number;
    setSalary : Function;
    selectedOption : string | null;
    handleRadioChange : Function;
    handleCloseSalaryPopup : MouseEventHandler;
    handleFormSubmit : FormEventHandler;
}


const VerifiedAccountForm = ({first, handleFormSubmit, salary, setSalary,selectedOption,handleRadioChange,handleCloseSalaryPopup} : Params) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-90">
      <h2 className="text-xl font-semibold">Verification</h2>
      <p className="text-red-400 text-sm mb-4">WARNING, {first} will have acesses to the portal</p>
      <p>Salary</p>
      <form onSubmit={handleFormSubmit}>
        <input
          type="number"
          placeholder="Enter salary"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
      
      <div className="mb-4">
          <p className="font-semibold mb-2">Role</p>
          <label className="flex items-center gap-2">
          <input
              type="radio"
              name="role"
              value="Instructor"
              checked={selectedOption === 'Instructor'}
              onChange={() => handleRadioChange('Instructor')}
          />
          Instructor
          </label>
          <label className="flex items-center gap-2">
          <input
              type="radio"
              name="role"
              value="Director"
              checked={selectedOption === 'Director'}
              onChange={() => handleRadioChange('Director')}
          />
          Director
          </label>
          <label className="flex items-center gap-2">
          <input
              type="radio"
              name="role"
              value="Unverify"
              checked={selectedOption === 'Unverify'}
              onChange={() => handleRadioChange('Unverify')}
          />
          Unverify
          </label>
      </div>

        <div className="flex justify-end gap-2">
          <Button type="button" className="bg-gray-500 hover:bg-gray-700" onClick={handleCloseSalaryPopup}>Cancel</Button>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-700">Submit</Button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default VerifiedAccountForm