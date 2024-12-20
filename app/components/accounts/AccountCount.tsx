import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface params{
    count : number
}

const AccountCount = ({count} : params) => {
  // Example data - in a real app this would come from props or an API
  const employeeCount = 1234;
  const departmentCount = 5;
  const growthRate = 15.6;

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Employee Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {count}
            </div>
            <p className="text-sm text-gray-500 mt-1">Current Employees</p>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCount;