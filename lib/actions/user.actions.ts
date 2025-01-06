"use server"

import Stamp from "../models/stamp.models";
import User from "../models/user.models"
import { connectToDB } from "../mongoose"
import { format } from 'date-fns';



interface Params {
  id : string;
  firstName: string;
  lastName: string;
  role: string;
  image : string;
  location : string;
}

export async function createOrFindUser({ id, firstName, lastName, role, image, location } : Params) : Promise<void> {
  try {
    // Find and update the user if exists, or create a new one if not
    connectToDB();
    
    await User.findOneAndUpdate(
      {id}, // Find by userId
      { firstName, lastName, role,image, onboarded : true,location }, // Fields to update
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options: new document if not found
    );

    console.log('User created or updated:');
  } catch (error) {
    console.error('Error in createOrFindUser:', error);
    throw error;
  }
}
interface Params1{
  id : string
}

export async function getUser({id} : Params1) : Promise<typeof User>{
  try{
    connectToDB();
    const user = await User.findOne({"id" : id});
    return user;
  }
  catch (error) {
    console.error('Error in createOrFindUser:', error);
    throw error;
  }
}

export async function isVerrified({id} : Params1) : Promise<boolean>{
  try{
    connectToDB();
    const user = await User.findOne({"id" : id});
    if(!user) return false;
    return user.verified;
  }
  catch (error) {
    console.error('Error in createOrFindUser:', error);
    throw error;
  }
}

export async function getRole({id} : Params1) : Promise<String>{
  try{
    connectToDB();
    const user = await User.findOne({"id" : id});
    if(!user) return "Unauthorized";
    return user.role;
  }
  catch (error) {
    console.error('Error in createOrFindUser:', error);
    throw error;
  }
}

export async function getAllUnverifiedInstructors({id} : Params1) : Promise<typeof User[]>{
  try{
    connectToDB();
    const user : any  = await getUser({id});

    if(user.role !== "Director" && user.role !== "Owner"){
      throw new Error("Unauthorized operation")
    }
    
    if(user.role === "Director"){
      const users = await User.find({ role: { $in: ["Instructor", "Director"] }, location : (user as any).location, verified: false });
      
      return users;
    }
    
    if(user.role === "Owner"){
      const users = await User.find({ role: { $in: ["Instructor", "Director"] }, verified: false });
      return users;
    }
    return [];
  }
  catch(error){
    throw error;
  }
}
export async function getAllInstructorsAndDirectors({id} : Params1) : Promise<typeof User[]>{
  try{
    connectToDB();
    const user: any= await getUser({id});
    if(user.role !== "Owner"){
      throw new Error("Unauthorized operation")
    }

    

    const users = await User.find({ role: { $in: ["Instructor", "Director"] }, verified: true });
    return users;

  }
  catch(error){
    throw error;
  }
}

export async function getAllInstructors({id} : Params1) : Promise<typeof User[]>{
  try{
    connectToDB();
    const user: any= await getUser({id});
    if(user.role !== "Director" && user.role !== "Owner"){
      throw new Error("Unauthorized operation")
    }
    if(user.role === "Director"){
      const users = await User.find({ role: { $in: ["Instructor"] }, location : user.location, verified: true });
      
      return users;
    }
    
    if(user.role === "Owner"){
      const users = await User.find({ role: { $in: ["Instructor"] }, verified: true });
      return users;
    }
    return [];
  }
  catch(error){
    throw error;
  }
}

interface Params2{
  OID : string,
  IID : string,
  sal : number,
  role : string | null,
  location : string;
}


export async function verifyUser({OID,IID,sal,role, location} : Params2) : Promise<void>{
  connectToDB();
  const Orole = await getRole({id : OID});
  if(Orole !== "Director" && Orole !== "Owner"){
    throw new Error("Unauthorized operation")
  }
  if(role === "Unverify"){
    await User.findOneAndUpdate(
      {id : IID}, // Find by userId
      { verified : false}
    );
    return;
  }
  await User.findOneAndUpdate(
    {id : IID}, // Find by userId
    { verified : true, pay : sal, role : role, location }, // Fields to update
  );
}
interface Params3{
  OID : string,
  IID : string,
}

export async function DeleteUser({OID,IID} : Params3) : Promise<void>{
  connectToDB();
  const Orole = await getRole({id : OID});
  if(Orole !== "Director"){
    throw new Error("Unauthorized operation")
  }
  await User.deleteOne(
    {id : IID}, // Find by userId Options: new document if not found
  );
}

interface Employee {
  id: string;
  name: string;
  status: 'clocked-in' | 'clocked-out';
  img : string;
  clockedIn: Date;
}

export async function getAllInstructorsAndTimeStatus({ id }: { id: string }): Promise<Employee[]> {
  try {
    await connectToDB();

    // Verify the role
    const role = await getRole({ id });
    if (role !== "Director" && role !== "Owner") {
      throw new Error("Unauthorized operation");
    }

    // Fetch all instructors
    const users : any = await getAllInstructors({id});
    // Fetch all timestamps with no clock-out time
    const timeLogs = await Stamp.find({ clockOut: null });
    // Map users to the desired format
    const employees: Employee[] = users.map((user : any) => {
      const matchingLog = timeLogs.find(log => log.id === user.id);
      
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        status: matchingLog ? 'clocked-in' : 'clocked-out',
        img : user.image,
        clockedIn : matchingLog ? matchingLog.clockIn : null,
        location : user.location
      };
    });

    return employees;
  } catch (error) {
    throw error;
  }
}


interface UserDates{
  id : string
  from : Date | undefined
  to : Date | undefined
}
interface Shift {
  _id : string;
  id: string;
  date: Date;
  to: Date;
  from: Date;
}
interface EmployeeTimes {
  id: string;
  name: string;
  role: string;
  hoursWorked: number;
  hourlyRate: number;
  overtime: number;
  lastClockIn: string;
  shifts: Shift[];
}

export async function getUsersAndTimeWorked({id,from,to} : UserDates) : Promise<EmployeeTimes[]>{
    try{
      const instructors = await getAllInstructors({id});
      let timestamps = await Stamp.find({
        lastUpdated: { $gte: from, $lte: to },
      });
      timestamps = timestamps.filter(shift => shift.clockOut !== null);
      const groupedTimestamps = timestamps.reduce((acc, timestamp) => {
        if (!acc[timestamp.id]) {
          acc[timestamp.id] = [];
        }
        acc[timestamp.id].push(timestamp);
        return acc;
      }, {} as Record<string, typeof timestamps>);
    
      // Map instructors to employees with their respective timestamps
      const employees: EmployeeTimes[] = instructors.map((instructor : any) => {
        const instructorTimestamps = groupedTimestamps[instructor.id] || [];
    
        const shifts = instructorTimestamps.map((timestamp : any) => ({
          id: timestamp._id.toString(),
          date: timestamp.lastUpdated,
          from: timestamp.clockIn,
          to: timestamp.clockOut,
        })).reverse();
    
        const totalHours = instructorTimestamps.reduce((total : any, timestamp : any) => {
          const hours =
            (new Date(timestamp.clockOut).getTime() - new Date(timestamp.clockIn).getTime()) /
            (1000 * 60 * 60);
          return total + hours;
        }, 0);
    
        const overtime = totalHours > 40 ? totalHours - 40 : 0;
    
        const lastClockIn = instructorTimestamps.length
          ? format(new Date(instructorTimestamps[instructorTimestamps.length - 1].clockIn), 'MM-dd-yyyy HH:mm:ss')
          : 'N/A';
    
        return {
          id: instructor.id,
          name: `${instructor.firstName} ${instructor.lastName}`,
          role: instructor.role,
          hoursWorked: totalHours,
          hourlyRate: instructor.pay,
          overtime,
          lastClockIn,
          shifts,
          location : instructor.location
        };
      });
      return (employees);
    }
    catch(error){
      throw(error);
    }
}