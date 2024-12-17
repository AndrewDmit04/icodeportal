"use server"


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