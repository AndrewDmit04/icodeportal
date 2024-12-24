"use client"
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/core';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface WeekDay {
  id: string;
  label: string;
}

interface Instructor {
  id: string;
  name: string;
}

interface ColorOption {
  id: string;
  color: string;
  label: string;
}

interface FormData {
  className: string;
  instructor: string;
  sprint: string;
  lesson: string;
  date: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  color: string;
  selectedDays: Record<string, boolean>;
}

const weekDays: WeekDay[] = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const instructors: Instructor[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
  { id: "4", name: "Sarah Wilson" },
];

const classColors: ColorOption[] = [
  { id: "blue", color: "#3788d8", label: "Blue" },
  { id: "green", color: "#2ecc71", label: "Green" },
  { id: "red", color: "#e74c3c", label: "Red" },
  { id: "purple", color: "#9b59b6", label: "Purple" },
  { id: "orange", color: "#e67e22", label: "Orange" },
];

const initialFormData: FormData = {
  className: '',
  instructor: '',
  sprint: '',
  lesson: '',
  date: '',
  startTime: '',
  endTime: '',
  startDate: '',
  endDate: '',
  color: '',
  selectedDays: {},
};

export default function Calendar(){
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayChange = (day: string): void => {
    setFormData(prev => ({
      ...prev,
      selectedDays: {
        ...prev.selectedDays,
        [day]: !prev.selectedDays[day]
      }
    }));
  };

  const createEvent = (): void => {
    const baseEvent: Partial<EventInput> = {
      title: `${formData.className} - ${formData.instructor}`,
      color: formData.color,
      extendedProps: {
        sprint: formData.sprint,
        lesson: formData.lesson,
        instructor: formData.instructor
      }
    };

    if (!isRepeating) {
      const newEvent: EventInput = {
        ...baseEvent,
        start: `${formData.date}T${formData.startTime}`,
        end: `${formData.date}T${formData.endTime}`,
      };
      setEvents(prev => [...prev, newEvent]);
    } else {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const newEvents: EventInput[] = [];

      while (startDate <= endDate) {
        const dayName = startDate.toLocaleDateString();
        if (formData.selectedDays[dayName]) {
          newEvents.push({
            ...baseEvent,
            start: `${startDate.toISOString().split('T')[0]}T${formData.startTime}`,
            end: `${startDate.toISOString().split('T')[0]}T${formData.endTime}`,
          });
        }
        startDate.setDate(startDate.getDate() + 1);
      }
      setEvents(prev => [...prev, ...newEvents]);
    }
    setIsOpen(false);
    setFormData(initialFormData);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="mb-4 h-[600px]">
        <FullCalendar
          height="100%"
          plugins={[dayGridPlugin, timeGridPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          slotMinTime="09:00:00"
          slotMaxTime="22:00:00"
          events={events}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="className" className="text-right">
                Class Name
              </Label>
              <Input
                id="className"
                value={formData.className}
                onChange={handleInputChange}
                placeholder="Enter class name"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructor" className="text-right">
                Instructor
              </Label>
              <Select onValueChange={(value) => handleSelectChange('instructor', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Select onValueChange={(value) => handleSelectChange('color', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {classColors.map((colorOption) => (
                    <SelectItem key={colorOption.id} value={colorOption.color}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: colorOption.color }}
                        />
                        {colorOption.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sprint" className="text-right">
                Sprint
              </Label>
              <Input
                id="sprint"
                value={formData.sprint}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter sprint (e.g., Sprint 1)"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson" className="text-right">
                Lesson
              </Label>
              <Input
                id="lesson"
                value={formData.lesson}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter lesson (e.g., Lesson 1.2)"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Repeating
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  checked={isRepeating}
                  onCheckedChange={setIsRepeating}
                />
                <Label>Enable repeating dates</Label>
              </div>
            </div>
            
            {!isRepeating ? (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    min="09:00"
                    max="22:00"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    min="09:00"
                    max="22:00"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    min="09:00"
                    max="22:00"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    min="09:00"
                    max="22:00"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Repeat On</Label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {weekDays.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={day.id}
                          checked={formData.selectedDays[day.id]}
                          onCheckedChange={() => handleDayChange(day.id)}
                        />
                        <Label htmlFor={day.id}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createEvent}>Add Class</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}