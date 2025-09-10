import { LogOut, MapPinPlus, Utensils } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

const useRoutes = () => {
   const pathname = usePathname()
   
   const routes = useMemo(() => [
      {
         label: 'Amala Spots',
         href: "/find-spot",
         icon: Utensils,
         active: pathname === "/find-spot"
      },
      {
         label: 'Add Spot',
         href: "/add-spot",
         icon: MapPinPlus,
         active: pathname === "/add-spot"
      },
      {
         label: 'Logout',
         href: "#",
         icon: LogOut,
      },
   ], [pathname])
   
   return routes
}

export default useRoutes