"use server"
import Location from "../models/location.models";
import { connectToDB } from "../mongoose";
import { getRole } from "./user.actions";

interface ParamsLoc {
    id : string;

}

export async function getAllLocations() : Promise<any> {
    try{
        connectToDB();

        const locations = await Location.find({}).lean();
        const plainLocations = locations.map((location : any) => ({
          ...location,
          id: location._id.toString(),
          _id : undefined
      }));
        return plainLocations;
    }
    catch(error){
        throw error;
    }
}

interface Params {
    id : string;
    name : string;
    address : string;
}


export async function createOrFindLocation({id, name, address } : Params) : Promise<void> {
    try {
      // Find and update the user if exists, or create a new one if not
      connectToDB();
      const role  = await getRole({id});
      if(role != "Owner"){
        throw new Error("You are not authorized to create a location");
      }
      await Location.findOneAndUpdate(
        {name}, // Find by userId
        { name,address }, // Fields to update
        { new: true, upsert: true, setDefaultsOnInsert: true } // Options: new document if not found
      );
    } catch (error) {
      console.error('Error in createOrFindUser:', error);
      throw error;
    }
  }

export async function deleteLocation({id, locationId} : {id : string, locationId : string}) : Promise<void> {
    try {
      // Find and update the user if exists, or create a new one if not
      connectToDB();
      const role  = await getRole({id});
      if(role != "Owner"){
        throw new Error("You are not authorized to create a location");
      }
      await Location.deleteOne({_id : locationId});
    } catch (error) {
      console.error('Error in createOrFindUser:', error);
      throw error;
    }
  }