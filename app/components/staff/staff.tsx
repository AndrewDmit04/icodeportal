"use client"
import AccountCount from '@/app/components/accounts/AccountCount';
import UnVerrifiedAccount from '@/app/components/accounts/UnVerrifiedAccount';
import VerrifiedAccount from '@/app/components/accounts/VerrifiedAccount';
import { getAllInstructors, getAllInstructorsAndDirectors, getAllUnverifiedInstructors, getRole } from '@/lib/actions/user.actions';
import React, { useEffect } from 'react';
import { Users, UserCheck, Clock } from 'lucide-react';
import { getAllLocations } from '@/lib/actions/locations.actions';
import { redirect } from 'next/navigation';

interface params{
    id : string;
}

const Staff = ({id} : params) => {
  const [verifiedStaff, setVerifiedStaff] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [unverifiedStaff, setUnverifiedStaff] = React.useState([]);
  
  useEffect(() => {{
    const getData = async () => {
        const role = await getRole({id : id});
        const isAdmin = role === "Director" || role === "Owner"
        if(!isAdmin){redirect('/punch')}
        
        let verifiedStaff;  
        if(role === "Director"){
          const verifiedStaff : any = await getAllInstructors({ id: id });
          setVerifiedStaff(verifiedStaff);
        }
        else{
          const verifiedStaff : any= await getAllInstructorsAndDirectors({ id: id });
          setVerifiedStaff(verifiedStaff);
        }
        const unverifiedStaff : any = await getAllUnverifiedInstructors({ id: id });
        setUnverifiedStaff(unverifiedStaff);
        const locations = await getAllLocations();
        setLocations(locations);
    }
    getData();
  }}, []); // eslint-disable-line


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Account Overview */}
      <div className="mb-12">
        <AccountCount count={verifiedStaff.length}/>
      </div>

      {/* Current Staff Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <UserCheck className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Current iCode Staff</h2>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {verifiedStaff.length} members
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {verifiedStaff.map((item: any) => (
            <VerrifiedAccount
              key={item.id}
              first={item.firstName}
              last={item.lastName}
              img={item.image}
              uid={item.id}
              role={item.role}
              pay={item.pay}
              OID={id}
              locations={locations}
              location={item.location}
            />
          ))}
        </div>
      </section>

      {/* Pending Verification Section */}
      <section className="space-y-6 mt-12">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <Clock className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-800">Awaiting Verification</h2>
          {unverifiedStaff.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
              {unverifiedStaff.length} pending
            </span>
          )}
        </div>

        {unverifiedStaff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unverifiedStaff.map((item: any) => (
              <UnVerrifiedAccount
                key={item.id}
                first={item.firstName}
                last={item.lastName}
                img={item.image}
                uid={item.id}
                OID={id}
                role={item.role}
                locations={locations}
                location={item.location}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No Pending Verifications</h3>
            <p className="text-gray-500 mt-2">All staff members have been verified</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Staff;
