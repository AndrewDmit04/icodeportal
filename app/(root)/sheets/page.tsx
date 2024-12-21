"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Users, DollarSign, TrendingUp } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  hoursWorked: number;
  hourlyRate: number;
  overtime: number;
  lastClockIn: string;
  weeklyHours: { date: string; hours: number }[];
}

const AdminHoursDashboard = () => {
  const [timePeriod, setTimePeriod] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API call
  const employees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Instructor',
      hoursWorked: 38.5,
      hourlyRate: 25,
      overtime: 0,
      lastClockIn: '2024-12-20 09:00 AM',
      weeklyHours: [
        { date: 'Mon', hours: 8 },
        { date: 'Tue', hours: 7.5 },
        { date: 'Wed', hours: 8 },
        { date: 'Thu', hours: 8 },
        { date: 'Fri', hours: 7 },
      ],
    },
    // Add more employees as needed
  ];

  const totalHours = employees.reduce((acc, emp) => acc + emp.hoursWorked, 0);
  const averageHours = totalHours / employees.length;
  const totalOvertime = employees.reduce((acc, emp) => acc + emp.overtime, 0);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Average Hours</p>
                <p className="text-2xl font-bold">{averageHours.toFixed(1)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Active Staff</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
        <Select
          value={timePeriod}
          onValueChange={setTimePeriod}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        <Button className="ml-auto">Export Report</Button>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Hours Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Last Clock In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.hoursWorked.toFixed(1)}</TableCell>
                  <TableCell>{employee.overtime}</TableCell>
                  <TableCell>{employee.lastClockIn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default AdminHoursDashboard;