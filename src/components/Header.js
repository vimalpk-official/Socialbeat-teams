import React, { useState, useContext, useRef, useCallback } from "react";
import { LogoutOutlined, MenuOutlined, BellOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Tooltip, Spin, message } from "antd";
import { AppContext } from "../context/AppContext";
import CustomModal from "./Modal";
import Notification from "./Notification";
import IndividualDrawer from "../pages/Home/IndividualDrawer";
import { useNavigate } from "react-router-dom";
import '../pages/Home/Home.css';


function Header() {
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const drawerRef = useRef();
  const navigate = useNavigate();

  const {
    clearAuth,
    headerFlag = false,
    setHeaderFlag,
  } = useContext(AppContext) || {};

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      if (clearAuth) clearAuth();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (setHeaderFlag) setHeaderFlag(false);
      setIsMobileMenuOpen(false);
      navigate("/");
      message.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Error during logout");
    } finally {
      setLoading(false);
    }
  }, [clearAuth, setHeaderFlag, navigate]);

  const handleNotificationOpen = useCallback(() => {
    setIsNotificationOpen(true);
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <div className="bg-white border-b px-4 py-3 shadow-sm overflow-x-hidden w-full h-[12vh]">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <img
            src="https://www.socialbeat.in/wp-content/themes/socialbeat/assets/images/sb-logos/sb_cheil_2025_logos.png"
            alt="Company Logo"
            className="h-14 w-auto"
            onError={(e) => {
              e.target.style.display = "none";
              console.error("Logo failed to load");
            }}
          />

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-6 ml-auto">
            {/* Notification icon */}
            {headerFlag && (
              <Tooltip title="Notifications">
                <div className="w-6 h-6 flex items-center justify-center">
                  <BellOutlined
                    onClick={handleNotificationOpen}
                    className="text-xl text-gray-600 hover:text-black cursor-pointer transition-colors duration-200"
                  />
                </div>
              </Tooltip>
            )}

            {/* Logout */}
            <Button
              icon={loading ? <Spin size="small" /> : <LogoutOutlined />}
              onClick={handleLogout}
              danger
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
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
            {/* Notifications */}
            {headerFlag && (
              <Button
                icon={<BellOutlined />}
                onClick={handleNotificationOpen}
                className="w-full"
              >
                Notifications
              </Button>
            )}

            {/* Logout */}
            <Button
              icon={loading ? <Spin size="small" /> : <LogoutOutlined />}
              onClick={handleLogout}
              danger
              disabled={loading}
              className="w-full"
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        )}
      </div>

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
    </>
  );
}

export default Header;
