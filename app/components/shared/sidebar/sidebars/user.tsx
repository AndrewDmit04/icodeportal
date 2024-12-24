import { LayoutDashboardIcon, Calendar, Timer, User, AlarmClock  } from "lucide-react"

export const userContents = [
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Time Sheets",
      url: "/sheets",
      icon: Timer,
    },
    {
      title: "Avalible Shifts",
      url: "#",
      icon: User,
    },
    {
        title: "Punch Card",
        url: "/punch",
        icon: AlarmClock,
    },
  ]