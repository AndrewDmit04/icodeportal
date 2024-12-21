"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Timer, CalendarClock, History, AlertCircle } from 'lucide-react';
import { clockIn } from '@/lib/actions/stamp.actions';

interface TimeEntry {
  date: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number;
}
interface Params{
    id : string;
}
const UserPunch = ({id } : Params) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorking, setIsWorking] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isWorking && clockInTime) {
        const elapsed = new Date(new Date().getTime() - clockInTime.getTime());
        const hours = elapsed.getUTCHours().toString().padStart(2, '0');
        const minutes = elapsed.getUTCMinutes().toString().padStart(2, '0');
        const seconds = elapsed.getUTCSeconds().toString().padStart(2, '0');
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWorking, clockInTime]);

  const handleClockInOut = async () => {
    const now = new Date();
    
    await clockIn({id : id})
    
    if (!isWorking) {
      setClockInTime(now);
      setIsWorking(true);
    } else if (clockInTime) {
      const hoursWorked = (now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      const newEntry: TimeEntry = {
        date: now.toLocaleDateString(),
        clockIn: clockInTime.toLocaleTimeString(),
        clockOut: now.toLocaleTimeString(),
        totalHours: Number(hoursWorked.toFixed(2))
      };
      setTimeEntries([newEntry, ...timeEntries]);
      setClockInTime(null);
      setIsWorking(false);
      setElapsedTime("00:00:00");
    }
  };

  const getTotalHoursToday = () => {
    const today = new Date().toLocaleDateString();
    return timeEntries
      .filter(entry => entry.date === today)
      .reduce((acc, curr) => acc + curr.totalHours, 0)
      .toFixed(2);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Live Time Display */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Clock className="w-12 h-12" />
              <div className="text-center md:text-left">
                <p className="text-sm font-medium opacity-90">Current Time</p>
                <h2 className="text-4xl font-bold">
                  {currentTime.toLocaleTimeString()}
                </h2>
              </div>
            </div>
            {isWorking && (
              <div className="flex items-center gap-2">
                <Timer className="w-6 h-6 animate-pulse" />
                <span className="text-2xl font-bold">{elapsedTime}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clock In/Out Button */}
      <Card className="text-center">
        <CardContent className="p-6">
          <Button
            className={`w-full md:w-64 h-16 text-lg font-semibold transition-all ${
              isWorking 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
            onClick={handleClockInOut}
          >
            {isWorking ? 'Clock Out' : 'Clock In'}
          </Button>
          {isWorking && clockInTime && (
            <p className="mt-4 text-gray-600">
              Clocked in at {clockInTime.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Hours Today</h3>
              </div>
              <span className="text-2xl font-bold text-blue-500">
                {getTotalHoursToday()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Clock-ins Today</h3>
              </div>
              <span className="text-2xl font-bold text-purple-500">
                {timeEntries.filter(entry => entry.date === new Date().toLocaleDateString()).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No time entries yet</p>
              </div>
            ) : (
              timeEntries.map((entry, index) => (
                <div 
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{entry.date}</p>
                    <p className="text-sm text-gray-500">
                      {entry.clockIn} - {entry.clockOut}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{entry.totalHours} hours</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPunch;