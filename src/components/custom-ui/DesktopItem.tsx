import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "../ui/tooltip";

interface DesktopItemProps {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  active?: boolean;
}

const DesktopItem = ({ href, label, icon: Icon, active }: DesktopItemProps) => {
  return (
    <li>
      {label === "Logout" ? (
        <Tooltip>
          <LogoutButton variant="outline">
            <TooltipTrigger>
              <Icon
                className="w-8 h-8"
                strokeWidth={1.6}
              />
            </TooltipTrigger>
          </LogoutButton>
          <TooltipContent
            align="center"
            side="bottom"
          >
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger>
            <Link
              href={href}
              className={buttonVariants({
                size: "icon",
                variant: active ? "default" : "outline",
              })}
            >
              <Icon
                className="w-8 h-8"
                strokeWidth={1.6}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            align="center"
            side="right"
          >
            <p>{label}</p>
          </TooltipContent>
          <span className="sr-only">{label}</span>
        </Tooltip>
      )}
    </li>
  );
};

export default DesktopItem;
