"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils"
import { addDays, subDays, format, startOfWeek } from "date-fns"
import { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon, File, FileDown, FileSpreadsheet, MapPin } from "lucide-react"
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
import { getRole, getUsersAndTimeWorked } from '@/lib/actions/user.actions';
import ShiftManagementModal from './TimeModal';
import {Skeleton} from "@/components/ui/skeleton" // Import Skeleton
import { exportEmployeeReport } from './fileExportFunctions/exportEmployeeReport';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {exportEmployeeReportCSV} from './fileExportFunctions/csvExportReport'

interface Employee {
  id: string;
  name: string;
  role: string;
  hoursWorked: number;
  hourlyRate: number;
  overtime: number;
  lastClockIn: string;
  location : string;
  shifts: { id: string, date: Date, to: Date, from: Date }[]
}

interface Params {
  id: string;
  locations : {id : string, name : string}[];
}

const AdminHoursDashboard = ({ id, locations }: Params) => {
  const [loading, setIsLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [timePeriod, setTimePeriod] = useState('this');
  const [searchQuery, setSearchQuery] = useState('');
  const [refresh,setRefresh] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [role, setRole] = useState<string>("");
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const today = new Date();
    const startOfBiWeekly = startOfWeek(today, { weekStartsOn: 1 });
    return {
      from: startOfBiWeekly,
      to: addDays(startOfBiWeekly, 13),
    };
  });

  useEffect(() => {
    const fetchInfo = async () => {
      if (date && date.from && date.to) {
        const instructors : any = await getUsersAndTimeWorked({ id: id, from: date.from, to: date.to })
        setEmployees(instructors);
        const role : any = await getRole({id});
        setRole(role);
        if(selectedEmployee !== null){
            const instructor : any = instructors.find((instructor : any) => instructor.id === selectedEmployee.id);
            setSelectedEmployee(instructor);
            console.log(instructor);
        }
        setIsLoading(false);
      }
    }
    
    fetchInfo();
  }, [date,refresh])

  const handleIndividualClick = (event: any) => {
    setSelectedEmployee(event)
  }
  const closePopup = () => {
    setSelectedEmployee(null)
  }

  const getPmAm = (time: Date | undefined) => {
    if (time) {
      return time.toLocaleDateString("en-US");
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
    } if (value === 'this') {
      setDate({
        from: startOfBiWeekly,
        to: addDays(startOfBiWeekly, 13),
      })
    }
    setTimePeriod(value);
  };


  const filteredEmployees = employees.filter(emp => 
    (selectedLocation === 'all' && emp.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (emp.location === selectedLocation && emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalHours = filteredEmployees.reduce((acc, emp) => acc + emp.hoursWorked, 0);
  let averageHours = totalHours / filteredEmployees.length;
  if (isNaN(averageHours)) {
    averageHours = 0;
  }
  

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {selectedEmployee && (
        <ShiftManagementModal
          employee={selectedEmployee}
          onClose={closePopup}
          id={id}
          setRefresh={setRefresh}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Hours</p>
                {loading ? <Skeleton className="w-20 h-8" /> :<p className="text-2xl font-bold">{ totalHours.toFixed(1) }</p>}
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
                {loading ? <Skeleton className="w-20 h-8"/> : <p className="text-2xl font-bold">{  averageHours.toFixed(1)  }</p>}
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
                {loading ? <Skeleton className="w-20 h-8"/> : <p className="text-2xl font-bold">{ filteredEmployees.length}</p>}
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      
      
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
        {timePeriod === "custom" ?
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
        
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="ml-auto flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Choose format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => exportEmployeeReportCSV(filteredEmployees)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => exportEmployeeReport(filteredEmployees)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <File className="h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      
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
                <TableHead>Last Clock In</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton className="w-full h-10" />
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className='cursor-pointer' onClick={() => handleIndividualClick(employee)}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.hoursWorked.toFixed(1)}</TableCell>
                    <TableCell>{employee.lastClockIn}</TableCell>
                    <TableCell>{locations.find((loc) => loc.id === employee.location)?.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
                    
    </div>
  );
};

export default AdminHoursDashboard;
