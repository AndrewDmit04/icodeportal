"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, UserCheck, UserX, History } from 'lucide-react';
import { getAllInstructorsAndTimeStatus } from '@/lib/actions/user.actions';
import { clockInOut } from '@/lib/actions/stamp.actions';
import {Skeleton} from "@/components/ui/skeleton" // Import your Skeleton component

interface Employee {
  id: string;
  img: string;
  name: string;
  status: 'clocked-in' | 'clocked-out';
}
interface Params {
  id: string;
}

const AdminPunch = ({ id }: Params) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  const clockInorOut = async ({ id }: Params) => {
    await clockInOut({ id: id });
  };

  useEffect(() => {
    const populate = async () => {
      try {
        const instructors = await getAllInstructorsAndTimeStatus({ id });
        setEmployees(instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false); // End loading
      }
    };
    populate();
  }, [id]);

  // Update current time every second
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
          const now = new Date().toLocaleTimeString();
          clockInorOut({ id: emp.id });
          return {
            ...emp,
            status: emp.status === 'clocked-in' ? 'clocked-out' : 'clocked-in',
            [emp.status === 'clocked-in' ? 'clockOutTime' : 'clockInTime']: now,
          };
        }
        return emp;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Time Display */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
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

      {/* Status Overview */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3)
            .fill(null)
            .map((_, idx) => (
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
                  {employees.filter(emp => emp.status === 'clocked-in').length}
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
                  {employees.filter(emp => emp.status === 'clocked-out').length}
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
                  {employees.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Time Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            Array(5)
              .fill(null)
              .map((_, idx) => <Skeleton key={idx} className="h-16 w-full mb-4" />)
          ) : (
            <div className="space-y-4">
              {employees.map(employee => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        employee.status === 'clocked-in' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <img src={employee.img} className="w-24 h-24 rounded-full" />
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-gray-500">Instructor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
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
