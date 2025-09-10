import { ReactNode } from "react"
import DesktopSideBar from "./DesktopSideBar"
import MobileTab from "./MobileTab"
import { currentUser } from "@clerk/nextjs/server"
import { mapClerkUser } from "@/lib/utils"

const SideBar = async ({ children }: { children: ReactNode }) => {
   const user = await currentUser()
   const appUser = mapClerkUser(user)
   
   return (
      <div className="h-full relative">
         <DesktopSideBar
            currentUser={appUser!}
         />
         <MobileTab />
         <div className="md:pl-20 h-full">
            {children}
         </div>
      </div>
   )
}

export default SideBar