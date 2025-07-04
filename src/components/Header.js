import React, { useState, useContext } from "react";
import {
  DownOutlined,
  MenuOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import { AppContext } from "../AppContext";
import CustomModal from "./Modal";
import Notification from "./Notification";

function Header() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle
  const [openModal, setOpenModal] = useState(false); // modal control
  const { email, headerFlag } = useContext(AppContext);
  const [open, setOpen] = useState(false);

   const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

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
        setOpenModal(true);
      }
    },
  };

  return (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Brand logo on the left */}
        <img
          src="https://www.socialbeat.in/wp-content/themes/socialbeat/assets/images/sb-logos/sb_cheil_2025_logos.png"
          alt="Company"
          className="h-14 w-auto"
        />

        {/* Right side (hidden on small screens) */}
        {headerFlag && (
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-lg font-semibold">Profile Info</div>
            <BellOutlined onClick={showDrawer} />
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  Menu
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        )}

        {/* Mobile menu toggle */}
        <div className="sm:hidden">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {/* Mobile dropdown content */}
      {isOpen && headerFlag && (
        <div className="sm:hidden mt-2 flex flex-col gap-2">
          <div className="text-base font-medium text-center">Profile Info</div>
          <Dropdown menu={menuProps}>
            <Button className="w-full">
              <Space>
                Menu
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      )}

      {/* Custom Modal */}
      <CustomModal
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      />
      
      <Notification open={open} onClose={onClose} />

    </div>
  );
}

export default Header;
