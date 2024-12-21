"use server"

import Stamp from "../models/stamp.models"
import { connectToDB } from "../mongoose"

interface Params{
    id : string
}

export async function isClockedIn({id} : Params) : Promise<boolean>{
    await connectToDB();
    try {
      const latestStamp = await Stamp.findOne().sort({ lastUpdated: -1 }).exec();
      if (latestStamp === null){
        return false;
      }
      return latestStamp.clockOut === null;
    
    } catch (error) {
      console.error('Error fetching the latest stamp:', error);
      throw new Error('Failed to fetch the latest stamp');
    }
}

export async function clockIn({id} : Params){
    const currentDate = new Date()
    if(!(await isClockedIn({id : id}))){
        const newStamp = new Stamp({
            id,
            clockIn: currentDate,
            clockOut: null,
            lastUpdated: currentDate,
          });
      
          await newStamp.save();
          console.log('Created a new timestamp for the user.');
    }
    else{
        console.log("updating")
        const latestStamp = await Stamp.findOne({ id })
        .sort({ lastUpdated: -1 }) // Sort by lastUpdated in descending order
        .exec();
        console.log(latestStamp)
        await Stamp.findByIdAndUpdate(
            latestStamp._id, // Use the ID of the fetched document
            { clockOut: currentDate, lastUpdated: currentDate }, // Fields to update
            { new: true } // Return the updated document
        );
        console.log("updated");
    }
}