"use client"
import { ReactNode } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useClerk } from "@clerk/nextjs"

interface LogoutButtonProps {
   children: ReactNode
   className?: string
   variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
}

const LogoutButton = ({ children, className, variant }: LogoutButtonProps) => {
   const {signOut} = useClerk()
   return (
      <Button 
         onClick={() => {
            const promise = signOut()
            toast.promise(promise, {
               loading: 'Logging out...',
               success: () => {
                  return "Logged out successfully!";
               },
               error: "Couldn't logout, try again!",
            })
         }} 
      type="submit" className={className} size="icon" variant={variant} asChild>
         {children}
      </Button> 
   )
}

export default LogoutButton
