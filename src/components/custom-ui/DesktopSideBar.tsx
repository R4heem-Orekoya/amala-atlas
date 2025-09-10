"use client"

import useRoutes from "@/hooks/useRoutes"
import { AppUser } from "@/types"
import { SignInButton } from "@clerk/nextjs"
import { Authenticated, Unauthenticated } from "convex/react"
import Link from "next/link"
import { LogoWithoutText } from "../logo"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import UserDropdown from "../user-dropdown"
import DesktopItem from "./DesktopItem"

interface DesktopSideBarProps {
   currentUser: AppUser
}

const DesktopSideBar = ({currentUser}: DesktopSideBarProps) => {
   const routes = useRoutes()
   
   return (
     <div className="hidden md:flex md:flex-col md:justify-between md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-20 md:px-4 md:py-4 md:overflow-y-auto md:border-r-[1px] md:border-border">
       <nav className="flex flex-col justify-between mt-4">
         <ul
           role="list"
           className="flex flex-col items-center space-y-4"
         >
       <Link href="/">
         <LogoWithoutText />
       </Link>
       <Separator/>
           {routes.map((route) => (
             <DesktopItem
               key={route.label}
               active={route.active}
               href={route.href}
               icon={route.icon}
               label={route.label}
             />
           ))}
         </ul>
       </nav>

       <div>
         <Authenticated>
           {currentUser && <UserDropdown user={currentUser} />}
         </Authenticated>
         <Unauthenticated>
           <SignInButton>
             <Button>Create an account</Button>
           </SignInButton>
         </Unauthenticated>
       </div>
     </div>
   );
}

export default DesktopSideBar
