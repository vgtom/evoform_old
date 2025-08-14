import {
  Box,
  ChevronLeftCircle, PlusCircleIcon,
  Settings2,
  UserCircle
} from "lucide-react";
import React, { FC, ReactNode } from "react";
import { Link, routes } from "wasp/client/router";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useSidebarStore } from "../store";

export type ReactFunctionWithChildren = FC<{ children: React.ReactNode, showSiderbar?: boolean }>;

type MenuItem = {
  icon: ReactNode;
  to:
    | typeof routes.AccountRoute.to
    | typeof routes.AccountRoute.to
    | typeof routes.FormsRoute.to;
  title: string;
  isActive: boolean;
  tag?: string;
};

const UserLayout: ReactFunctionWithChildren = ({ children, showSiderbar = true }) => {
  // const [open, setOpen] = useState(false);
  const {isSidebarOpened: open, toggleSidebar} = useSidebarStore()
  

  const userSideMenuItems: MenuItem[] = [
    {
      title: "Forms",
      to: routes.FormsRoute.to,
      icon: <PlusCircleIcon />,
      isActive: location.pathname.startsWith("/forms"),
    },
    {
      title: "User",
      to: routes.AccountRoute.to,
      icon: <UserCircle />,
      isActive: location.pathname === "/account",
    },
  ];

  return (
    <div
      className={cn(
        "grid  overflow-hidden h-screen transition-all", showSiderbar ? "grid-cols-[max-content_1fr]" : "grid-cols-1"
      )}
    >
      {showSiderbar && <TooltipProvider delayDuration={100}>
        <div className="relative">
          <button
            className="absolute z-20 top-2 left-[calc(100%-12px)] text-white  bg-green-500 rounded-full scale-125"
            onClick={toggleSidebar}
          >
            <ChevronLeftCircle
              // color="black"
              className={cn(open ? "" : "rotate-180", "transition-all ")}
            />
          </button>
          <div
            className={cn(
              "relative bg-[#00280f] text-white h-screen grid justify-start items-start grid-rows-[max-content_1fr_max-content] overflow-hidden transition-all ",
              open ? "w-[13rem]" : "w-[3rem]"
            )}
          >
            <Link
              className="flex gap-3 text-green-300 font-bold text-xl mt-5 p-2"
              to={routes.DemoAppRoute.to}
            >
              <Box size={30} /> EvoForms
            </Link>
            <div className="grid py-15 gap-2 ">
              {userSideMenuItems.map((i) => (
                <Link
                  to={i.to}
                  key={i.to.toString()}
                  className={cn(
                    "flex gap-3 border-l-2  h-fit px-3 py-[4px] cursor-pointer",
                    i.isActive ? "border-green-300" : "border-transparent"
                  )}
                >
                  <Tooltip>
                    <TooltipTrigger> {i.icon}</TooltipTrigger>
                    <TooltipContent className="bg-black" side="right">
                      <p className="text-sm">{i.title}</p>
                    </TooltipContent>
                  </Tooltip>{" "}
                  {i.title}
                </Link>
              ))}
            </div>
            <div className="pb-5">
              <div className="flex gap-3 border-l-2 border-green-300 h-fit px-3 py-[4px] cursor-pointer">
                <Settings2 /> Settings
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>}
      <div className="overflow-y-auto overflow-x-hidden min-h-screen bg-gradient-to-br from-green-50">{children}</div>
    </div>
  );
};

export default UserLayout;
