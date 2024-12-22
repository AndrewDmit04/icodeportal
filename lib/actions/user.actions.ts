"use server"


import { time } from "console";
import Stamp from "../models/stamp.models";
import User from "../models/user.models"
import { connectToDB } from "../mongoose"


interface Params {
  id : string;
  firstName: string;
  lastName: string;
  role: string;
  image : string;
}

export async function createOrFindUser({ id, firstName, lastName, role, image } : Params) : Promise<void> {
  try {
    // Find and update the user if exists, or create a new one if not
    connectToDB();
    
    await User.findOneAndUpdate(
      {id}, // Find by userId
      { firstName, lastName, role,image, onboarded : true }, // Fields to update
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
    return user.role;
  }
  catch (error) {
    console.error('Error in createOrFindUser:', error);
    throw error;
  }
}

export async function getAllInstructors({id} : Params1) : Promise<typeof User[]>{
  try{
    connectToDB();
    const role = await getRole({id});
    if(role !== "Director"){
      throw new Error("Unauthorized operation")
    }
    const users = await User.find({role : "Instructor"})
    return users;
  }
  catch(error){
    throw error;
  }
}

interface Params2{
  OID : string,
  IID : string,
  sal : number,
  role : string | null
}


export async function verifyUser({OID,IID,sal,role} : Params2) : Promise<void>{
  connectToDB();
  const Orole = await getRole({id : OID});
  if(Orole !== "Director"){
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
    { verified : true, pay : sal, role : role }, // Fields to update
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
}

export async function getAllInstructorsAndTimeStatus({ id }: { id: string }): Promise<Employee[]> {
  try {
    await connectToDB();

    // Verify the role
    const role = await getRole({ id });
    if (role !== "Director") {
      throw new Error("Unauthorized operation");
    }

    // Fetch all instructors
    const users = await User.find({ role: "Instructor" });
    
    // Fetch all timestamps with no clock-out time
    const timeLogs = await Stamp.find({ clockOut: null });
    // Map users to the desired format
    const employees: Employee[] = users.map(user => {
      const matchingLog = timeLogs.find(log => log.id === user.id);
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        status: matchingLog ? 'clocked-in' : 'clocked-out',
        img : user.image,
      };
    });

    return employees;
  } catch (error) {
    throw error;
  }
}