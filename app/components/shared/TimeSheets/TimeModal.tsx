import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from 'lucide-react';
import ShiftEditModal from './EditShifts';
import { CreateStamp, DeleteStamp, updateStamp } from '@/lib/actions/stamp.actions';

const ShiftManagementModal = ({ 
    employee, 
    onClose,
    id
} : any) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState(null);
    const [editingShift, setEditingShift] = useState(null);
    const [isNew, setIsNew] = useState(false);

    const getPmAm = (time : Date) => {
        return `${(time.getHours() % 12 || 12)}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')} ${time.getHours() >= 12 ? 'PM' : 'AM'}`
    };

    const getDuration = (from : Date, to : Date) => {
        const timeDifferenceInMinutes = (to.getTime() - from.getTime()) / (1000 * 60);
        const hours = Math.floor(timeDifferenceInMinutes / 60);
        const minutes = Math.round(timeDifferenceInMinutes % 60);
        return (`${hours} hours and ${minutes} minutes`);
    };

    const handleEditClick = (shift: any) => {
        setEditingShift(shift);
        setIsEditModalOpen(true);
    };

    const handleAddClick = async () => {
        setEditingShift(null);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (shift: any) => {
        setShiftToDelete(shift);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteShift = async () => {
        if (shiftToDelete) {
            await DeleteStamp({id : id, stamp : shiftToDelete})
            setShiftToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleSaveShift = async (shiftData: any) => {
        console.log('Saving shift:', shiftData);
        if(isNew){
            await CreateStamp({OID : id , UID : employee.id, stamp : shiftData});
        }
        else{
            await updateStamp({ id: id, stamp: shiftData });
        }
        setIsEditModalOpen(false);
    };

    return (
        <>
            <Dialog open={employee} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {employee.name}'s Shifts
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="h-[60vh] w-full pr-4">
                        <div className="space-y-4">
                            {employee.shifts.map((shift: any) => (
                                <Card key={shift.id} className="bg-white shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <p className="text-sm">
                                                    <span className="font-semibold">Date: </span>
                                                    {shift.date.toDateString()}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">From: </span>
                                                    {getPmAm(shift.from)}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">To: </span>
                                                    {getPmAm(shift.to)}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Duration: </span>
                                                    {getDuration(shift.from, shift.to)}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleEditClick(shift)}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(shift)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex justify-between mt-4 space-x-2">
                        <Button 
                            variant="default"
                            onClick={handleAddClick}
                            className="flex-1"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Shift
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ShiftEditModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveShift}
                initialData={editingShift}
                isNew={setIsNew}
            />

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this shift?</p>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteShift}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ShiftManagementModal;
