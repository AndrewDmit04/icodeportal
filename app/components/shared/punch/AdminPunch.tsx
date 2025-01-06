"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, UserCheck, UserX, History, MapPin } from 'lucide-react';
import { getAllInstructorsAndTimeStatus, getRole } from '@/lib/actions/user.actions';
import { clockInOut } from '@/lib/actions/stamp.actions';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Employee {
  id: string;
  img: string;
  name: string;
  status: 'clocked-in' | 'clocked-out';
  clockedIn: Date | null;
  location: string;
}

interface Params1 {
  id: string;
  locations: { id: string; name: string; }[];
}

const AdminPunch = ({ id, locations }: Params1) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [role, setRole] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const clockInorOut = async ({ id }: { id: string }) => {
    await clockInOut({ id: id });
  };

  const getPmAm = (time: Date) => {
    return `${(time.getHours() % 12 || 12)}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')} ${time.getHours() >= 12 ? 'PM' : 'AM'}`
  }

  useEffect(() => {
    const populate = async () => {
      try {
        const instructors: any = await getAllInstructorsAndTimeStatus({ id });
        const role : any = await getRole({id})
        setRole(role);
        setEmployees(instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };
    populate();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockInOut = async (employeeId: string) => {
    setEmployees(
      employees.map(emp => {
        if (emp.id === employeeId) {
          const now = new Date()
          clockInorOut({ id: emp.id });
          return {
            ...emp,
            status: emp.status === 'clocked-in' ? 'clocked-out' : 'clocked-in',
            [emp.status === 'clocked-in' ? 'clockOutTime' : 'clockInTime']: now.toLocaleString,
            clockedIn: emp.status === 'clocked-in' ? null : now
          };
        }
        return emp;
      })
    );
  };

  // Filter employees based on selected location
  const filteredEmployees = employees.filter(emp => 
    (selectedLocation === 'all' && emp.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (emp.location === selectedLocation && emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        {/* Time Display Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex-grow mr-4">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Clock className="w-12 h-12" />
              <div>
                <p className="text-sm font-medium opacity-90">Current Time</p>
                <h2 className="text-4xl font-bold">
                  {`${(currentTime.getHours() % 12 || 12)}:${currentTime
                    .getMinutes()
                    .toString()
                    .padStart(2, '0')}:${currentTime
                    .getSeconds()
                    .toString()
                    .padStart(2, '0')} ${currentTime.getHours() >= 12 ? 'PM' : 'AM'}`}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium opacity-90">Today's Date</p>
              <p className="text-xl">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Filter */}
        {role === "Owner" &&(
        <Card className="w-64">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Location Filter</span>
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>)}
      </div>

      {/* Status Overview */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(null).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Currently Working</h3>
                </div>
                <span className="text-2xl font-bold text-green-500">
                  {filteredEmployees.filter(emp => emp.status === 'clocked-in').length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserX className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold">Clocked Out</h3>
                </div>
                <span className="text-2xl font-bold text-red-500">
                  {filteredEmployees.filter(emp => emp.status === 'clocked-out').length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Total Staff</h3>
                </div>
                <span className="text-2xl font-bold text-blue-500">
                  {filteredEmployees.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Time Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            Array(5).fill(null).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full mb-4" />
            ))
          ) : (
            <div className="flex  gap-4  flex-wrap">
              {filteredEmployees.map(employee => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-96"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        employee.status === 'clocked-in' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <Image
                      className="relative rounded-full border-2 border-white shadow-md"
                      src={employee.img}
                      alt={`${employee.name}`}
                      width={80}
                      height={80}
                      priority
                    />
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="text-sm text-gray-500">
                        Location: {locations.find((item) => item.id === employee.location)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {employee.clockedIn && (
                      <div>
                        <p>Clocked in at</p>
                        <p>{getPmAm(employee.clockedIn)}</p>
                      </div>
                    )}
                    <Button
                      onClick={() => handleClockInOut(employee.id)}
                      className={
                        employee.status === 'clocked-in'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }
                    >
                      {employee.status === 'clocked-in' ? 'Clock Out' : 'Clock In'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPunch;