"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function Calendar() {
  return (
    <div className="w-100 h-screen">
          <FullCalendar
            height={"auto"}
            plugins={[dayGridPlugin, timeGridPlugin]} // Initialize calendar with required plugins.
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }} // Set header toolbar options.
            initialView="timeGridWeek" // Initial view mode of the calendar.
            editable={true} // Allow events to be edited.
            selectable={true} // Allow dates to be selectable.
            selectMirror={true} // Mirror selections visually.
            dayMaxEvents={true} // Limit the number of events displayed per day.
            initialEvents={
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("events") || "[]")
                : []
            }
            events={[{title : "event 1" , start : "2024-12-19T04:00:00", end : "2024-12-19T09:00:00",  allDay : false,},
            {title : "event 2" , start : "2024-12-19T04:00:00", end : "2024-12-19T09:00:00",  allDay : false, color : "red"}
        ]}
          />
    </div>

  )
}