
import { LayoutDashboardIcon, Calendar, Timer, User, AlarmClock, FileSpreadsheet  } from "lucide-react"

export const adminContents = [
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