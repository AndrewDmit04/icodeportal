"use server"

import Stamp from "../models/stamp.models"
import { connectToDB } from "../mongoose"
import { getRole } from "./user.actions";

interface Params{
    id : string,
}

export async function isClockedIn({id} : Params) : Promise<boolean>{
    await connectToDB();
    try {
      const latestStamp = await Stamp.findOne({id}).sort({ lastUpdated: -1 }).exec();
      if (latestStamp === null){
        return false;
      }
      return latestStamp.clockOut === null;
    
    } catch (error) {
      console.error('Error fetching the latest stamp:', error);
      throw new Error('Failed to fetch the latest stamp');
    }
}

export async function clockInOut({ id }: Params) {
    try {
      await connectToDB();
      const currentDate = new Date();
      
      if (!(await isClockedIn({ id }))) {
        const newStamp = new Stamp({
          id,
          clockIn: currentDate,
          clockOut: null,
          lastUpdated: currentDate,
        });
  
        await newStamp.save();
      } else {
        console.log("updating");
        const latestStamp = await Stamp.findOne({ id })
          .sort({ lastUpdated: -1 }) // Sort by lastUpdated in descending order
          .exec();
  
        await Stamp.findByIdAndUpdate(
          latestStamp._id, // Use the ID of the fetched document
          { clockOut: currentDate, lastUpdated: currentDate }, // Fields to update
          { new: true } // Return the updated document
        );
      }
    } catch (error) {
      console.error("Error in clockInOut:", error);
      throw error; // Optionally rethrow or handle error as needed
    }
  }
  
  export const getTodaysShifts = async ({ id }: Params) => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today
  
      // Query for shifts within today's range
      const shifts = await Stamp.find({
        id: id,
        lastUpdated: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ lastUpdated: -1 });
  
      // Filter out shifts where clockOut is null
      const validShifts = shifts.filter(shift => shift.clockOut !== null);
  
      return validShifts.map((shift) => {
        const clockInTime = shift.clockIn ? new Date(shift.clockIn) : null;
        const clockOutTime = shift.clockOut ? new Date(shift.clockOut) : null;
  
        const totalHours =
          clockInTime && clockOutTime
            ? (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60) // Correct calculation of hours worked
            : 0;
  
        return {
          date: shift.lastUpdated.toLocaleDateString(),
          clockIn: clockInTime ? clockInTime.toLocaleTimeString() : '',
          clockOut: clockOutTime ? clockOutTime.toLocaleTimeString() : '',
          totalHours: totalHours.toFixed(2), // Returning hours as a string with two decimals
        };
      });
    } catch (error) {
      console.error("Error in getTodaysShifts:", error);
      throw error; // Optionally rethrow or handle error as needed
    }
  };
  
  export async function getClockInTime({ id }: Params) {
    try {
      await connectToDB();
      const latestStamp = await Stamp.findOne({ id }).sort({ lastUpdated: -1 }).exec();
      return latestStamp?.clockIn || null; // Return null if no clockIn time is found
    } catch (error) {
      console.error("Error in getClockInTime:", error);
      throw error; // Optionally rethrow or handle error as needed
    }
  }

  interface stamp{
    id : string
    from : Date;
    to : Date;
    date : Date;
  }
  interface stampFunction{
    id : string;
    stamp : stamp;
  }
  export async function updateStamp({id, stamp} : stampFunction){
    try{
      connectToDB(); 
      const role = await getRole({id});
      if(role !== "Director"){
        throw new Error("Unauthorized Action")
      }
      await Stamp.findOneAndUpdate(
        {_id : stamp.id},
        {clockIn : stamp.from, clockOut : stamp.to, lastUpdated : stamp.date} )
    }
    catch(Error){
      throw(Error);
    }
  }

  export async function DeleteStamp({id,stamp} : stampFunction ) : Promise<void>{
    connectToDB();
    const role = await getRole({id : id});
    if(role !== "Director"){
      throw new Error("Unauthorized operation")
    }
    await Stamp.deleteOne(
      {_id : stamp.id},
    );
  }
  interface creatingStamp{
    OID : string;
    UID : string;
    stamp : stamp;
  }

  export async function CreateStamp({OID,UID,stamp}: creatingStamp)  {
    connectToDB();
    const role = await getRole({id : OID});
    if(role !== "Director"){
      throw new Error("Unauthorized operation")
    }
    const newStamp = new Stamp({
      id : UID,
      clockIn: stamp.from,
      clockOut: stamp.to,
      lastUpdated: stamp.date,
    });

    await newStamp.save();
    
    
  }
  interface getUserStamps{
    UID : string
    id : string,
    from : Date,
    to : Date

  }

  export async function getUserStamps({UID, id, from, to} : getUserStamps){
    try{
      if(UID != id){
        throw Error("Unauthorized Action");
      }
      const timestamps = await Stamp.find({
        id : id,
        lastUpdated: {$gte: from, $lte: to },
      }).lean();
      const formattedStamps: stamp[] = timestamps.map((timestamp) => ({
        id: timestamp.id,
        from: timestamp.clockIn,
        to: timestamp.clockOut,
        date: timestamp.lastUpdated,
      }));
      return formattedStamps;

    }
    catch(error){
      throw(error)
    }
  }
  