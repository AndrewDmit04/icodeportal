"use client"
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Trash2 } from 'lucide-react';
import { createOrFindLocation, deleteLocation, getAllLocations } from '@/lib/actions/locations.actions';
import { set } from 'mongoose';
import { Skeleton } from '@/components/ui/skeleton';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface LocationParams {
  id: string;
}

const LocationsPage = ({ id }: LocationParams) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await getAllLocations();
        setLocations(locations);
        console.log(locations);
        setLoading(false);
      } catch (err) {
        throw err;
      }
    };
    fetchData();
  }, [id]);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const emptyLocation: Location = {
    id: '',
    name: '',
    address: '',
  };

  const [formData, setFormData] = useState<Location>(emptyLocation);

  const handleOpenDialog = (location: Location | null = null) => {
    if (location) {
      setFormData(location);
      setSelectedLocation(location);
      setIsEditMode(true);
    } else {
      setFormData(emptyLocation);
      setSelectedLocation(null);
      setIsEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (isEditMode) {
      setLocations(locations.map(loc =>
        selectedLocation && loc.id === selectedLocation.id
          ? { ...formData, id: loc.id }
          : loc
      ));
    } else {
      const newLocation: Location = {
        ...formData,
      };
      setLocations([...locations, newLocation]);
    }
    await createOrFindLocation({ id, name: formData.name, address: formData.address });

    setIsDialogOpen(false);
    setFormData(emptyLocation);
    setSelectedLocation(null);
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!selectedLocation) return;
    await deleteLocation({ id, locationId: selectedLocation.id });
    setLocations(locations.filter(loc => selectedLocation && loc.id !== selectedLocation.id));
    setIsDeleteDialogOpen(false);
    setIsDialogOpen(false);
    setFormData(emptyLocation);
    setSelectedLocation(null);
    setIsEditMode(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Locations</h1>
          <p className="text-gray-500">Manage your organization's locations</p>
        </div>
        
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Location' : 'Add New Location'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Modify the location details.' : 'Enter the details for the new location.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Headquarters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street Address"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <div>
              {isEditMode && (
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="mr-2"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {isEditMode ? 'Update' : 'Save'} Location
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the location 
              "{selectedLocation?.name}" and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={2}><Skeleton className='w-full h-20'></Skeleton></TableCell></TableRow> : 
            <>
            {locations.map((location : Location) => (
              <TableRow 
                key={location.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleOpenDialog(location)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                    {location.name}
                  </div>
                </TableCell>
                <TableCell>{location.address}</TableCell>
              </TableRow>
            ))}</>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LocationsPage;