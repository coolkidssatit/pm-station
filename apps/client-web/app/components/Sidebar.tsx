import {
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  ProSidebar,
} from "~/components/Menu";
import {
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MusicalNoteIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Link, useMatches } from "@remix-run/react";
import { UserRole, useUser } from "~/utils/pm-station/client";
import { useEffect, useState } from "react";
import { SidebarContent, SidebarFooter } from "react-pro-sidebar";

const MusicIcon = <MusicalNoteIcon className="h-4 w-4" />;

function SongRequestMenu({ showIcon = true }: { showIcon?: boolean }) {
  return (
    <MenuItem
      icon={showIcon ? MusicIcon : undefined}
      route="/pm-station/app/songrequests/"
    >
      ส่งคำขอเปิดเพลง
    </MenuItem>
  );
}

function EditorSongRequestMenu() {
  return (
    <SubMenu
      route="/pm-station/app/songrequests"
      title="PM Music Request"
      icon={MusicIcon}
    >
      <SongRequestMenu showIcon={false} />
      <MenuItem route="/pm-station/app/songrequests/editor">
        จัดการคำขอเพลง
      </MenuItem>
      <MenuItem route="/pm-station/app/songrequests/playlists">
        จัดการรายการคำขอเพลง
      </MenuItem>
    </SubMenu>
  );
}
export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isRegistered } = useUser();

  const matches = useMatches();
  useEffect(() => {
    setOpen(false);
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed(true);
    }
  }, [matches, setOpen, setCollapsed]);

  useEffect(() => {
    const listener = () => {
      setCollapsed(window.matchMedia("(min-width: 1024px)").matches);
    };
    const mql = window.matchMedia("(min-width: 1024px)");
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  return (
    <ProSidebar
      collapsed={collapsed}
      collapsedWidth={83}
      toggled={open}
      onToggle={setOpen}
      breakPoint="lg"
    >
      <SidebarHeader>
        <Link to="/pm-station/app" title="PM Station">
          <div className="px-2 py-3 flex gap-3 items-center overflow-hidden h-20">
            <div className="flex-shrink-0">
              <img
                draggable={false}
                src="/logo.png"
                alt="Logo"
                width="40"
                height="40"
                className=""
              />
            </div>
            <h1
              className={`text-xl leading-6 font-bold transition-all ${
                !collapsed ? "opacity-100" : "opacity-0"
              } duration-300 ease-in`}
            >
              PM Station
            </h1>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            icon={<UserIcon className="h-4 w-4" />}
            route="/pm-station/app/profile"
          >
            ข้อมูลส่วนตัว
          </MenuItem>
          {isRegistered &&
            user?.role !== undefined &&
            (user?.role >= UserRole.EDITOR ? (
              <EditorSongRequestMenu />
            ) : (
              <SongRequestMenu />
            ))}
        </Menu>
      </SidebarContent>

      <SidebarFooter>
        <form method="post" action="/pm-station/app/logout">
          <button className="w-full" type="submit" title="ออกจากระบบ">
            <Menu className="border-gray-600">
              <MenuItem icon={<ArrowLeftOnRectangleIcon className="h-4 w-4" />}>
                ออกจากระบบ
              </MenuItem>
            </Menu>
          </button>
        </form>

        <Menu
          className="border-gray-600"
          iconShape={collapsed ? undefined : "circle"}
        >
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            title="เปิด/ปิด"
            className="w-full"
            id="toggle-sidebar"
          >
            <MenuItem
              icon={
                collapsed ? (
                  <ChevronDoubleLeftIcon className="h-4 w-4" />
                ) : (
                  <ChevronDoubleRightIcon className="h-4 w-4" />
                )
              }
            >
              เปิด/ปิด
            </MenuItem>
          </button>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  );
}
