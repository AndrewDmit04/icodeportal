"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils"
import { addDays,subDays, format, startOfWeek } from "date-fns"
import { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getUsersAndTimeWorked } from '@/lib/actions/user.actions';

interface Employee {
  id: string;
  name: string;
  role: string;
  hoursWorked: number;
  hourlyRate: number;
  overtime: number;
  lastClockIn: string;
  shifts : {id : string, date : Date, to : Date, from : Date }[]
}
interface Params{
    id : string;
}

const AdminHoursDashboard = ({id} : Params) => {  

  
  const [timePeriod, setTimePeriod] = useState('this');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Instructor',
      hoursWorked: 38.5,
      hourlyRate: 25,
      overtime: 0,
      lastClockIn: '2024-12-20 09:00 AM',
      shifts : [{id : "22", date : new Date(), to : new Date(), from :  new Date }]
    }])
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const today = new Date();
    // Adjust to the start of the week (Monday as the start of the bi-weekly cycle)
    const startOfBiWeekly = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
    return {
      from: startOfBiWeekly,
      to: addDays(startOfBiWeekly, 13), // 13 days after the start date
    };
  });
  useEffect(()=>{
    const fetchInfo = async () =>{
        if (date && date.from && date.to){
            await getUsersAndTimeWorked({id : id, from : date.from, to : date.to})
        } 
        return
    }
    fetchInfo();
    },[])

  
  const getPmAm = (time : Date | undefined) =>{
    if (time){
      return time.toLocaleDateString();
    }
    return '';
  }
  const handleTimePeriodChange = (value: string) => {
    const today = new Date();
    const startOfBiWeekly = startOfWeek(today, { weekStartsOn: 1 });
    if (value === 'last') {
      
      setDate({
        from: subDays(startOfBiWeekly, 14),
        to: startOfBiWeekly
      })

    }if (value === 'this') {
      setDate({
        from: startOfBiWeekly,
        to: addDays(startOfBiWeekly, 13),
      })
    } 
    setTimePeriod(value);
  };
  


  const totalHours = employees.reduce((acc, emp) => acc + emp.hoursWorked, 0);
  const averageHours = totalHours / employees.length;

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
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
        <Select
          value={timePeriod}
          onValueChange={handleTimePeriodChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last">Last Pay Period</SelectItem>
            <SelectItem value="this">This Pay Period</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        { timePeriod === "custom" ?
        <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover> : <></>
      }
        <p>from {getPmAm(date?.from)} to {getPmAm(date?.to)}</p>
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