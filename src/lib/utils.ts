import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserResource } from "@clerk/types";
import type { User } from "@clerk/nextjs/server";
import { AppUser } from "@/types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
