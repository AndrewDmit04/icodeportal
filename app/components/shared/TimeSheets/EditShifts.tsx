import React, { SetStateAction, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShiftData {
  date: Date;
  from: Date;
  to: Date;
  id?: string;
}

interface ShiftEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ShiftData) => void;
  initialData: ShiftData | null;
  isNew : any;
}

interface FormValues {
  date: Date;
  fromHour: string;
  fromMinute: string;
  toHour: string;
  toMinute: string;

}

const ShiftEditModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  isNew
}: ShiftEditModalProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');

  const form = useForm<FormValues>({
    defaultValues: {
      date: initialData?.date || new Date(),
      fromHour: initialData?.from?.getHours().toString().padStart(2, '0') || "09",
      fromMinute: initialData?.from?.getMinutes().toString().padStart(2, '0') || "00",
      toHour: initialData?.to?.getHours().toString().padStart(2, '0') || "17",
      toMinute: initialData?.to?.getMinutes().toString().padStart(2, '0') || "00",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (initialData) {
        setErrorMessage('')
        reset({
        date: initialData.date || new Date(),
        fromHour: initialData.from?.getHours().toString().padStart(2, '0') || "09",
        fromMinute: initialData.from?.getMinutes().toString().padStart(2, '0') || "00",
        toHour: initialData.to?.getHours().toString().padStart(2, '0') || "17",
        toMinute: initialData.to?.getMinutes().toString().padStart(2, '0') || "00",
      });
      isNew(false);
    }
    else{
        setErrorMessage('')
        reset({
            date:  new Date(),
            fromHour: "09",
            fromMinute:  "00",
            toHour: "17",
            toMinute: "00",
          });
        isNew(true);
    }
    return reset();
  }, [initialData, reset]);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => (i).toString().padStart(2, '0'));

  const onSubmit = (data: FormValues) => {
    const baseDate = new Date(data.date);
    const fromDate = new Date(baseDate);
    const toDate = new Date(baseDate);

    if (data.fromHour > data.toHour || data.fromHour === data.toHour && data.fromMinute > data.toMinute) {
        setErrorMessage("Start time must be before End time")
        return;
      }
    fromDate.setHours(parseInt(data.fromHour), parseInt(data.fromMinute));
    toDate.setHours(parseInt(data.toHour), parseInt(data.toMinute));

    const shiftData: ShiftData = {
      date: baseDate,
      from: fromDate,
      to: toDate,
      ...(initialData?.id ? { id: initialData.id } : {})
    };
    onSave(shiftData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? 'Edit Shift' : 'Add New Shift'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <div className="relative">
                    <div className="relative w-full">
                      <Button
                        type="button"
                        onClick={() => setIsCalendarOpen(true)}
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                      </Button>
                      {isCalendarOpen && (
                        <div className="absolute top-full mt-1 z-50 bg-white rounded-md shadow-lg">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setIsCalendarOpen(false);
                              }
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                          
                        </div>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormLabel>Start Time</FormLabel>
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="fromHour"
                    render={({ field, fieldState }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fromMinute"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute} value={minute}>
                              :{minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormLabel>End Time</FormLabel>
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="toHour"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toMinute"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute} value={minute}>
                              :{minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
            {errorMessage && <p className='text-red-400'>{errorMessage}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftEditModal;