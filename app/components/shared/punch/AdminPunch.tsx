"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, UserCheck, UserX, History } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'clocked-in' | 'clocked-out';
  clockInTime?: string;
  clockOutTime?: string;
}

const AdminPunch = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'John Doe', role: 'Instructor', status: 'clocked-out' },
    { id: '2', name: 'Jane Smith', role: 'Director', status: 'clocked-in', clockInTime: '09:00 AM' },
    // Add more employee data as needed
  ]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockInOut = (employeeId: string) => {
    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        const now = new Date().toLocaleTimeString();
        return {
          ...emp,
          status: emp.status === 'clocked-in' ? 'clocked-out' : 'clocked-in',
          [emp.status === 'clocked-in' ? 'clockOutTime' : 'clockInTime']: now
        };
      }
      return emp;
    }));
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
                {`${(currentTime.getHours() % 12 || 12)}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')} ${currentTime.getHours() >= 12 ? 'PM' : 'AM'}`}
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
                day: 'numeric'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
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

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Time Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map(employee => (
              <div 
                key={employee.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    employee.status === 'clocked-in' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <h4 className="font-medium">{employee.name}</h4>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last Action</p>
                    <p className="font-medium">
                      {employee.status === 'clocked-in' ? employee.clockInTime : employee.clockOutTime}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleClockInOut(employee.id)}
                    className={employee.status === 'clocked-in' 
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPunch;