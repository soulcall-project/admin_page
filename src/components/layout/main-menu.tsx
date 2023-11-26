import { Divider } from "antd";
import { Monitor, User } from "lucide-react";
import React from "react";
import Menu, { IMenu } from "./nav";

const mainMenuData: IMenu[] = [
  {
    id: "home",
    name: "유저 관리",
    icon: <User className="w-5 h-5" />,
    submenu: [
      {
        id: "manageUser",
        name: "일반 유저 관리",
        link: {
          path: "/",
        },
      },
      {
        id: "manageCounsler",
        name: "상담사 관리",
        link: {
          path: "/counsler",
        },
      },
    ],
  },
];

const counselor: IMenu[] = [
  {
    id: "counselor",
    name: "상담로그",
    icon: <Monitor className="w-5 h-5" />,
    link: {
      path: "/counselor_list",
    },
  },
];

const MainMenu = () => {
  return (
    <>
      <>
        <Divider orientation="left" plain>
          유저
        </Divider>

        <Menu data={mainMenuData} />
      </>
      <>
        <Divider orientation="left" plain>
          상담
        </Divider>

        <Menu data={counselor} />
      </>
    </>
  );
};

export default React.memo(MainMenu);
