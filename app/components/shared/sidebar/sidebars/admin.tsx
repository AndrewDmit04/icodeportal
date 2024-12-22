
import { LayoutDashboardIcon, Calendar, Timer, User, AlarmClock, FileSpreadsheet  } from "lucide-react"

export const adminContents = [
    {
      title: "DashBoard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: User,
    },
    {
      title: "Punch Card",
      url: "/punch",
      icon: AlarmClock,
    },
    {
      title: "Time Sheets",
      url: "/sheets",
      icon: FileSpreadsheet,
    },
  ]