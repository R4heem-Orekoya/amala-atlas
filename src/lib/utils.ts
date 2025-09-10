import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserResource } from "@clerk/types";
import type { User } from "@clerk/nextjs/server";
import { AppUser } from "@/types";


export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function haversine({
   lat1,
   lat2,
   lon1,
   lon2,
}: {
   lat1: number;
   lon1: number;
   lat2: number;
   lon2: number;
}) {
   const R = 6371;
   const dLat = ((lat2 - lat1) * Math.PI) / 180;
   const dLon = ((lon2 - lon1) * Math.PI) / 180;
   const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
         Math.cos((lat2 * Math.PI) / 180) *
         Math.sin(dLon / 2) ** 2;
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return R * c;
}

function isClientUser(user: UserResource | User): user is UserResource {
  return "primaryEmailAddress" in user;
}

export function mapClerkUser(user: UserResource | User | null | undefined): AppUser | null {
  if (!user) return null;

  if (isClientUser(user)) {
    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      fullName: user.fullName ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      imageUrl: user.imageUrl ?? null,
    };
  }

  return {
    id: user.id,
    email: user.emailAddresses?.[0]?.emailAddress ?? null,
    fullName: user.fullName ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    imageUrl: user.imageUrl ?? null,
  };
}
