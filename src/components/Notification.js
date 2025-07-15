import React, { useState, useContext, useEffect } from "react";
import { Drawer, Card, Button, notification } from "antd";
import { createStyles, useTheme } from "antd-style";
import CustomModal from "./Modal";
import { AppContext } from "../context/AppContext";

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

  const handleOpen = (member) => {
    console.log("Opening modal for member:", member);
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleOk = (updatedData) => {
    console.log("✅ Received from modal:", updatedData);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { notificationqueue, setnotificationqueue } = useContext(AppContext);

  // Fixed the membersData structure - assuming notificationqueue is an array
  const membersData = Array.isArray(notificationqueue)
    ? notificationqueue.map((item) => ({
        key: item.key,
        name: item.name,
        email: item.email,
        designation: item.designation,
        designationText: item.designation, // Added this field as it's used in the render
        doj: item.doj,
        team: item.team || [],
        dob: item.dob,
        yoe: item?.yoe,
        profilePicture: item.profilePicture
          ? item.profilePicture
          : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNEREREREQiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDEwQzEyLjc2MTQgMTAgMTUgNy43NjE0MiAxNSA1QzE1IDIuMjM4NTggMTIuNzYxNCAwIDEwIDBDNy4yMzg1OCAwIDUgMi4yMzg1OCA1IDVDNSA3Ljc2MTQyIDcuMjM4NTggMTAgMTAgMTBaTTEwIDEyLjVDNi42NjI1IDEyLjUgMCAxNC4xNjI1IDAgMTcuNVYyMEgyMFYxNy41QzIwIDE0LjE2MjUgMTMuMzM3NSAxMi41IDEwIDEyLjVaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo8L3N2Zz4K", // Default avatar
        about: item.about,
        teamSlugs: item.teamSlugs || [],
      }))
    : [];

  console.log(notificationqueue, "fghhgghjjh");

  return (
    <Drawer
      title="Notifications"
      placement="right"
      open={open}
      onClose={onClose}
      className="!p-2"
      classNames={classNames}
      styles={drawerStyles}
    >
      {membersData.map((member) => (
        <Card
          key={member.key}
          className="relative mb-3 cursor-pointer border border-gray-300 hover:border-blue-500 !mb-1"
          style={{ width: 350 }}
          bodyStyle={{ padding: 10 }}
          onClick={() => handleOpen(member)}
        >
          {/* Member Details */}
          <div className="flex items-center gap-3">
            <img
              src={member.profilePicture}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{member.name}</div>
              <div className="text-sm text-gray-600">
                {member.designationText}
              </div>
              <div className="text-xs text-gray-400">
                {Array.isArray(member.team)
                  ? member.team.map((t) => t.name).join(", ")
                  : ""}
              </div>
            </div>
          </div>
        </Card>
      ))}

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
