"use client"
import AccountCount from '@/app/components/accounts/AccountCount';
import UnVerrifiedAccount from '@/app/components/accounts/UnVerrifiedAccount';
import VerrifiedAccount from '@/app/components/accounts/VerrifiedAccount';
import { getAllInstructors, getAllInstructorsAndDirectors, getAllUnverifiedInstructors, getRole } from '@/lib/actions/user.actions';
import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Clock, MapPin, Search } from 'lucide-react';
import { getAllLocations } from '@/lib/actions/locations.actions';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from "@/components/ui/skeleton";

interface params {
  id: string;
}

const Staff = ({ id }: params) => {
  const [verifiedStaff, setVerifiedStaff] = useState([]);
  const [locations, setLocations] = useState([]);
  const [unverifiedStaff, setUnverifiedStaff] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [first,setFirst] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        if(first){
          setIsLoading(true);
          setFirst(false);
        }
        const userRole: any = await getRole({ id: id });
        setRole(userRole);
        const isAdmin = userRole === "Director" || userRole === "Owner"
        if (!isAdmin) { redirect('/punch') }

        let staffData : any;
        if (userRole === "Director") {
          staffData = await getAllInstructors({ id: id });
        } else {
          staffData = await getAllInstructorsAndDirectors({ id: id });
        }
        setVerifiedStaff(staffData);

        const unverifiedData : any = await getAllUnverifiedInstructors({ id: id });
        setUnverifiedStaff(unverifiedData);
        
        const locationData = await getAllLocations();
        setLocations(locationData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [refresh]); // eslint-disable-line

  // Filter staff based on location and search query
  const filteredVerifiedStaff = verifiedStaff.filter((staff: any) => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "all" || staff.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const filteredUnverifiedStaff = unverifiedStaff.filter((staff: any) => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "all" || staff.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Filters Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
        {isLoading ? <Skeleton className='w-full h-32'/> : 
        <>
        <div className='flex gap-10 '>
          <div >
            <AccountCount count={verifiedStaff.length} />
          </div>
          

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            {role === "Owner" && (
              <Card className="w-full h-full flex justify-center items-center">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-md font-medium text-gray-500">Location</span>
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location: any) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
        </>}
      </div>
      
      <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[300px]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
      {/* Current Staff Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <UserCheck className="w-6 h-6 text-green-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Current iCode Staff</h2>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {filteredVerifiedStaff.length} members
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          { isLoading ? Array(3).fill(null).map((_, idx) => (
                          <Skeleton key={idx} className="h-56 w-full" />
                        )) :
          <>
          {filteredVerifiedStaff.map((item: any) => (
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
              setRefresh={setRefresh}
            />
          ))}
          </>}
        </div>

        {filteredVerifiedStaff.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No Staff Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </section>

      {/* Pending Verification Section */}
      <section className="space-y-6 mt-12">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <Clock className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Awaiting Verification</h2>
          {filteredUnverifiedStaff.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
              {filteredUnverifiedStaff.length} pending
            </span>
          )}
        </div>
        
        { isLoading ? <Skeleton className="h-56 w-full" /> :
        <>
        {filteredUnverifiedStaff.length > 0 && !isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredUnverifiedStaff.map((item: any) => (
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
                setRefresh={setRefresh}
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
        </>}
      </section>
    </div>
  );
};

export default Staff;