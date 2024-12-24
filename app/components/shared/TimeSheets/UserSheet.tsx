"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils"
import { addDays, subDays, format, startOfWeek } from "date-fns"
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
import ShiftManagementModal from './TimeModal';
import {Skeleton} from "@/components/ui/skeleton" // Import Skeleton
import { exportEmployeeReport } from './exportEmployeeReport';
import { getUserStamps } from '@/lib/actions/stamp.actions';

interface shifts{ id: string, date: Date, to: Date, from: Date }[]

interface Params {
  id: string;
}

const UserHoursDashboard = ({ id }: Params) => {
  const [loading, setIsLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState('this');
  const [shifts, setShifts] = useState<shifts[]>([]);
  const [totalTimeWorked, setTotalTimeWorked] = useState(0);
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const today = new Date();
    const startOfBiWeekly = startOfWeek(today, { weekStartsOn: 1 });
    return {
      from: startOfBiWeekly,
      to: addDays(startOfBiWeekly, 13),
    };
  });
  const getDuration = (from : Date, to : Date) => {
    const timeDifferenceInMinutes = (to.getTime() - from.getTime()) / (1000 * 60);
    const hours = Math.floor(timeDifferenceInMinutes / 60);
    const minutes = Math.round(timeDifferenceInMinutes % 60);
    return (`${hours} hours and ${minutes} minutes`);
};
  useEffect(() => {
    function calculateTotalTimeWorked(shifts: shifts[]): number {
        let totalMinutes = 0;
      
        shifts.forEach(shift => {
          if(shift){
            const startTime = shift.from.getTime(); // Convert start time to milliseconds
            const endTime = shift.to.getTime(); // Convert end time to milliseconds
            const shiftDuration = (endTime - startTime) / (1000 * 60); // Duration in minutes
            totalMinutes += shiftDuration;
          }
        });
      
        return totalMinutes / 60; // Convert total minutes to hours
      }
    
    const fetchInfo = async () => {
      if (date && date.from && date.to) {
        const shifts = await getUserStamps({ UID : id, id: id, from: date.from, to: date.to })
        setShifts(shifts);
        const hours = calculateTotalTimeWorked(shifts);
        setTotalTimeWorked(hours)
        setIsLoading(false);
      }
    }
    fetchInfo();
  }, [date])



  const getPmAm = (time: Date | undefined) => {
    if (time) {
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
    } if (value === 'this') {
      setDate({
        from: startOfBiWeekly,
        to: addDays(startOfBiWeekly, 13),
      })
    }
    setTimePeriod(value);
  };


   
  


  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Hours</p>
                {loading ? <Skeleton className="w-20 h-8" /> :<p className="text-2xl font-bold">{ totalTimeWorked.toFixed(1) }</p>}
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center">

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
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Time Worked</TableHead>
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
                shifts.map((shift) => (
                  <TableRow key={shift.id} className='cursor-pointer'>
                    <TableCell className="font-medium">{shift.date.toLocaleDateString()}</TableCell>
                    <TableCell>{shift.from.toLocaleTimeString()}</TableCell>
                    <TableCell>{shift.to.toLocaleTimeString()}</TableCell>
                    <TableCell>{getDuration(shift.from,shift.to)}</TableCell>
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

export default UserHoursDashboard;
