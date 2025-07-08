
import React, { useRef, useState, useContext } from "react";
import {
  LogoutOutlined,
  DownOutlined,
  MenuOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space, Tooltip } from "antd";
import { AppContext } from "../context/AppContext";
import CustomModal from "./Modal";
import Notification from "./Notification";
import IndividualDrawer from "../pages/Home/IndividualDrawer";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

function Header() {
  const [loading, setLoading] = useState(false);

  const drawerRef = useRef();
  const navigate = useNavigate();

  const {
    clearAuth,
    email,
    headerFlag,
    setHeaderFlag, 
  } = useContext(AppContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const items = [
    {
      label: "Add member",
      key: "add-member",
      icon: <UserOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: ({ key }) => {
      if (key === "add-member") {
        setIsModalOpen(true);
      }
    },
  };

  const handleLogout = () => {
    clearAuth();
    localStorage.clear();
    setLoading(true); // Show spinner

    setTimeout(() => {
      setHeaderFlag(false);
      setIsMobileMenuOpen(false);
      navigate("/");
      setLoading(false); // Just in case navigate fails or for safety
    }, 1000);
  };

  return (
    <div className="bg-white border-b px-4 py-3 shadow-sm overflow-x-hidden w-full">
      <div className="flex justify-between items-center">
        <img
          src="https://www.socialbeat.in/wp-content/themes/socialbeat/assets/images/sb-logos/sb_cheil_2025_logos.png"
          alt="Company Logo"
          className="h-14 w-auto"
        />

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center gap-6 ml-auto">
          {headerFlag && (
            <Tooltip title="Notifications">
              <div className="w-6 h-6 flex items-center justify-center">
                <BellOutlined
                  onClick={() => setIsNotificationOpen(true)}
                  className="text-xl text-gray-600 hover:text-black cursor-pointer transition-colors duration-200"
                />
              </div>
            </Tooltip>
          )}

          <Button
            size="medium"
            className="text-base"
            onClick={() => drawerRef.current?.openDrawer()}
          >
            View Profile
          </Button>

          {headerFlag && (
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  Menu
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          )}

          <Button
            icon={loading ? <Spin size="small" /> : <LogoutOutlined />}
            onClick={handleLogout}
            danger
            disabled={loading}
          >
            {loading ? "Logout" : "Logout"}
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="sm:hidden ml-auto">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-3 flex flex-col gap-3">
          {headerFlag && (
            <Button
              icon={<BellOutlined />}
              onClick={() => {
                setIsNotificationOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              Notifications
            </Button>
          )}
          <Button
            onClick={() => {
              drawerRef.current?.openDrawer();
              setIsMobileMenuOpen(false);
            }}
          >
            View Profile
          </Button>
          {headerFlag && (
            <Dropdown menu={menuProps}>
              <Button className="w-full">
                <Space>
                  Menu
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          )}
          <Button
            icon={loading ? <Spin size="small" /> : <LogoutOutlined />}
            onClick={handleLogout}
            danger
            disabled={loading}
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      )}

      {/* Modals and Drawers */}
      <CustomModal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      />

      <Notification
        open={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <IndividualDrawer ref={drawerRef} />
    </div>
  );
}

export default Header;
