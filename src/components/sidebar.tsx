import {
  DashboardOutlined,
  DatabaseOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { BASE_PATH } from "../constants/app";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

export const SideBar = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");

  const onClick = (key: string) => {
    setCurrent(key);
    switch (key) {
      case "user":
        navigate(`${BASE_PATH}/user`);
        break;
      case "conversation":
        navigate(`${BASE_PATH}/conversation`);
        break;
      case "training-data":
        navigate(`${BASE_PATH}/training-data`);
        break;
      case "dashboard":
        navigate(`${BASE_PATH}/dashboard`);
        break;
      case "goal":
        navigate(`${BASE_PATH}/goal`);
        break;
      case "goal-config":
        navigate(`${BASE_PATH}/goal-config`);
        break;
      default:
        break;
    }
  };

  const items = [
    {
      label: "User Management",
      key: "user",
      icon: <UserOutlined />,
    },
    {
      label: "Conversation",
      key: "conversation",
      icon: <MessageOutlined />,
    },
    {
      label: "Training Data",
      key: "training-data",
      icon: <DatabaseOutlined />,
    },
    {
      label: "Goal",
      key: "goal",
      icon: <DatabaseOutlined />,
    },
    {
      label: "Goal Config",
      key: "goal-config",
      icon: <DatabaseOutlined />,
    },
  ];

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("dashboard")) {
      setCurrent("dashboard");
    }
    if (pathname.includes("user")) {
      setCurrent("user");
    }
    if (pathname.includes("conversation")) {
      setCurrent("conversation");
    }
    if (pathname.includes("training-data")) {
      setCurrent("training-data");
    }
    if (pathname.includes("goal-config")) {
      setCurrent("goal-config");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-64 h-full pt-16 duration-75 lg:flex transition-width"
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1 bg-white divide-y">
            <ul className="pb-2 space-y-2">
              <li>
                <form action="#" method="GET" className="lg:hidden">
                  <label htmlFor="mobile-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="email"
                      id="mobile-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:ring-cyan-600 block w-full pl-10 p-2.5"
                      placeholder="Search"
                    />
                  </div>
                </form>
              </li>
              <li>
                <button
                  className={classNames(
                    "w-full text-left text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group",
                    {
                      "bg-gray-100": current === "dashboard",
                    }
                  )}
                  onClick={() => onClick("dashboard")}
                >
                  <DashboardOutlined />
                  <span className="ml-3">Dashboard</span>
                </button>
              </li>
              {items.map((item) => (
                <li>
                  <button
                    onClick={() => onClick(item.key)}
                    className={classNames(
                      "w-full text-left text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group",
                      {
                        "bg-gray-100": current === item.key,
                      }
                    )}
                  >
                    {item.icon}
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};
