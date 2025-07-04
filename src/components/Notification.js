import React, { useState } from "react";
import { Drawer, Card, Button } from "antd";
import { createStyles, useTheme } from "antd-style";
import CustomModal from "./Modal";

// Custom drawer styles using antd-style tokens
const useStyle = createStyles(({ token }) => ({
  "my-drawer-body": {
    background: token.blue1,
  },
  "my-drawer-mask": {
    boxShadow: `inset 0 0 15px #fff`,
  },
  "my-drawer-header": {
    background: token.green1,
  },
  "my-drawer-footer": {
    color: token.colorPrimary,
  },
}));

const Notification = ({ open, onClose }) => {
  const { styles } = useStyle();
  const token = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const classNames = {
    body: styles["my-drawer-body"],
    mask: styles["my-drawer-mask"],
    header: styles["my-drawer-header"],
    footer: styles["my-drawer-footer"],
    content: styles["my-drawer-content"],
  };

  const drawerStyles = {
    mask: {
      backdropFilter: "blur(10px)",
    },
    content: {
      boxShadow: "-10px 0 10px #666",
    },
    header: {
      borderBottom: `1px solid ${token.colorPrimary}`,
    },
    body: {
      padding: 5,
      fontSize: token.fontSizeLG,
    },
    footer: {
      borderTop: `1px solid ${token.colorBorder}`,
    },
  };

  const handleOpen = () => {
    setSelectedMember(null); // Can pass member object if needed
    setIsModalOpen(true);
  };

  const handleOk = (data) => {
    console.log("Modal submitted with data:", data);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Drawer
      title="Notifications"
      placement="right"
      open={open}
      onClose={onClose}
      className="!p-2"
      footer={
        <div style={{ position: "relative", height: 40 }}>
          <Button
            type="default"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              borderColor: token.colorPrimary,
              color: token.colorPrimary,
            }}
            onClick={onClose}
          >
            Clear All
          </Button>
        </div>
      }
      classNames={classNames}
      styles={drawerStyles}
    >
      {/* Notification Card that opens modal on click */}
      <Card
        className="relative mb-3 cursor-pointer border border-gray-300 hover:border-blue-500"
        style={{ width: 350 }}
        bodyStyle={{ padding: 10 }}
        onClick={handleOpen}
      >
        Vimal changed his bio
      </Card>


      {/* Modal */}
      <CustomModal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        selectedMember={selectedMember}
      />
    </Drawer>
  );
};

export default Notification;
