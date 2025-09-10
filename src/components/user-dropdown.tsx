"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppUser } from "@/types";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

interface UserDropdownProps {
   user: AppUser;
}

export default function UserDropdown({ user }: UserDropdownProps) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
               <AvatarImage
                  src={
                     user.imageUrl ??
                     `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.firstName}`
                  }
               />
               <AvatarFallback className="font-medium">
                  {user.fullName?.charAt(0)}
               </AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-[280px] mt-2 rounded-lg">
            <div className="p-1 flex items-center gap-2">
               <Avatar className="size-9">
                  <AvatarImage
                     src={
                        user.imageUrl ??
                        `https://api.dicebear.com/9.x/dylan/svg?seed=${user.fullName}`
                     }
                  />
                  <AvatarFallback className="font-medium">
                     {user.fullName?.charAt(0)}
                  </AvatarFallback>
               </Avatar>
               <div className="grid">
                  <p className="text-sm">{user.fullName}</p>
                  <span className="text-xs text-muted-foreground">
                     {user.email}
                  </span>
               </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
               <Link
                  href="/"
                  className="flex items-center gap-2 tracking-tight"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     width="24"
                     height="24"
                     color="#000000"
                     fill="none"
                  >
                     <path
                        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        stroke="#141B34"
                        strokeWidth="1.5"
                     />
                     <path
                        d="M14 14H10C7.23858 14 5 16.2386 5 19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19C19 16.2386 16.7614 14 14 14Z"
                        stroke="#141B34"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                     />
                  </svg>
                  Account Details
               </Link>
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive" className="cursor-pointer">
               <SignOutButton>
                  <span className="flex items-center gap-2">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        className="text-red-500"
                        viewBox="0 0 24 24"
                     >
                        <path
                           fill="currentColor"
                           d="M5.47 12.53a.75.75 0 0 1 0-1.06l2-2a.75.75 0 0 1 1.06 1.06l-.72.72H15a.75.75 0 0 1 0 1.5H7.81l.72.72a.75.75 0 1 1-1.06 1.06z"
                        ></path>
                        <path
                           fill="currentColor"
                           fillRule="evenodd"
                           d="M13.945 1.25h1.11c1.368 0 2.47 0 3.337.117c.9.12 1.658.38 2.26.981c.602.602.86 1.36.982 2.26c.116.867.116 1.97.116 3.337v8.11c0 1.367 0 2.47-.116 3.337c-.121.9-.38 1.658-.982 2.26s-1.36.86-2.26.982c-.867.116-1.97.116-3.337.116h-1.11c-1.367 0-2.47 0-3.337-.116c-.9-.122-1.658-.38-2.26-.982c-.398-.4-.647-.868-.805-1.402c-.951-.001-1.744-.012-2.386-.098c-.764-.103-1.426-.325-1.955-.854s-.751-1.19-.854-1.955c-.098-.73-.098-1.656-.098-2.79V9.447c0-1.133 0-2.058.098-2.79c.103-.763.325-1.425.854-1.954s1.19-.751 1.955-.854c.642-.086 1.435-.097 2.386-.098c.158-.534.407-1.003.806-1.402c.601-.602 1.36-.86 2.26-.981c.866-.117 1.969-.117 3.336-.117M7.252 17.004c.004.645.014 1.225.05 1.745c-.834-.003-1.454-.018-1.945-.084c-.598-.08-.89-.224-1.094-.428s-.348-.496-.428-1.094c-.083-.619-.085-1.443-.085-2.643v-5c0-1.2.002-2.024.085-2.643c.08-.598.224-.89.428-1.094s.496-.348 1.094-.428c.491-.066 1.111-.08 1.946-.084c-.037.52-.047 1.1-.051 1.745a.75.75 0 0 0 1.5.008c.006-1.093.034-1.868.142-2.457c.105-.566.272-.895.515-1.138c.277-.277.666-.457 1.4-.556c.755-.101 1.756-.103 3.191-.103h1c1.436 0 2.437.002 3.192.103c.734.099 1.122.28 1.4.556c.276.277.456.665.555 1.4c.102.754.103 1.756.103 3.191v8c0 1.435-.001 2.436-.103 3.192c-.099.734-.279 1.122-.556 1.399s-.665.457-1.399.556c-.755.101-1.756.103-3.192.103h-1c-1.435 0-2.436-.002-3.192-.103c-.733-.099-1.122-.28-1.399-.556c-.243-.244-.41-.572-.515-1.138c-.108-.589-.136-1.364-.142-2.457a.75.75 0 1 0-1.5.008"
                           clipRule="evenodd"
                        ></path>
                     </svg>
                     Logout
                  </span>
               </SignOutButton>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
