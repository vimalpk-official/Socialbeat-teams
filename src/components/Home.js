import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import CustomModal from "./Modal";
import {
  Table,
  Image,
  Drawer as AntDrawer,
  Descriptions,
  Button,
  Upload,
  DatePicker,
  Input,
} from "antd";
import {
  RightCircleOutlined,
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Header from "./Header";
import dayjs from "dayjs";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createStyles, useTheme } from "antd-style";
import "./Home.css";
import { AppContext } from "../AppContext";

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

const Row = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

const ProfileDrawer = ({
  selectedMember,
  isDrawerVisible,
  setIsDrawerVisible,
  email,
  headerFlag,
  onUpdateMember,
  onRemoveMember,
  onOpenModal, // Added this prop
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  console.log("this is vimal " + editedData);

  useEffect(() => {
    if (selectedMember) {
      setEditedData({ ...selectedMember });
    }
  }, [selectedMember]);

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (field, date) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      setEditedData((prev) => ({
        ...prev,
        profilePicture: info.file.response.url,
      }));
    }
  };

  const handleImageRemove = () => {
    setEditedData((prev) => ({
      ...prev,
      profilePicture: "",
    }));
  };

  const handleSave = () => {
    console.log("Saved data:", editedData);
    if (onUpdateMember) {
      onUpdateMember(editedData);
    }
    setIsEditing(false);
    setIsDrawerVisible(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...selectedMember });
  };

  const handleRemove = () => {
    console.log("Remove member:", selectedMember);
    if (onRemoveMember) {
      onRemoveMember(selectedMember);
    }
    setIsDrawerVisible(false);
  };

  const handleUpdate = () => {
    console.log("Update member:", selectedMember);

    if (onOpenModal) {
      onOpenModal(selectedMember); // Pass data to modal
    }
  };

  const { styles } = useStyle();
  const token = useTheme();

  const classNames = {
    body: styles["my-drawer-body"],
    mask: styles["my-drawer-mask"],
    header: styles["my-drawer-header"],
    footer: styles["my-drawer-footer"],
  };

  const drawerStyles = {
    mask: { backdropFilter: "blur(10px)" },
    content: { boxShadow: "-10px 0 10px #666" },
    header: { borderBottom: `1px solid ${token.colorPrimary}` },
    body: { fontSize: token.fontSizeLG },
    footer: { borderTop: `1px solid ${token.colorBorder}` },
  };

  return (
    <AntDrawer
      title={selectedMember?.name}
      placement="right"
      open={isDrawerVisible}
      onClose={() => {
        setIsDrawerVisible(false);
        setIsEditing(false);
        setEditedData({});
      }}
      classNames={classNames}
      styles={drawerStyles}
      width={500}
    >
      {selectedMember && (
        <>
          <div className="flex justify-between items-start w-full mb-4">
            <Image
              width={100}
              src={selectedMember.profilePicture}
              alt="Profile"
              className="rounded-full"
              fallback="/default-avatar.png"
            />

            {email === selectedMember.email && !isEditing && (
              <div
                className="flex items-center text-[#1890ff] cursor-pointer"
                onClick={() => {
                  setIsEditing(true);
                  setEditedData({ ...selectedMember });
                }}
              >
                <EditOutlined style={{ fontSize: 20 }} />
                <span className="ml-2">Edit</span>
              </div>
            )}
          </div>

          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Profile Picture">
              {isEditing ? (
                <div>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/api/upload"
                    beforeUpload={() => false}
                    onChange={handleImageUpload}
                  >
                    {editedData.profilePicture ? (
                      <img
                        src={editedData.profilePicture}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                  {editedData.profilePicture && (
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={handleImageRemove}
                      style={{ marginTop: 8 }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {selectedMember.profilePicture ? (
                    <Image
                      className="!p-2"
                      width={100}
                      src={selectedMember.profilePicture}
                      alt="Profile"
                      fallback="/default-avatar.png"
                    />
                  ) : (
                    "No profile picture"
                  )}
                </div>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {isEditing ? (
                <Input
                  value={editedData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                selectedMember.email
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Designation">
              {isEditing ? (
                <Input
                  value={editedData.designation}
                  onChange={(e) =>
                    handleInputChange("designation", e.target.value)
                  }
                />
              ) : (
                selectedMember.designation
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Team">
              {isEditing ? (
                <Input
                  value={editedData.team}
                  onChange={(e) => handleInputChange("team", e.target.value)}
                />
              ) : (
                selectedMember.team
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Date of Joining">
              {isEditing ? (
                <DatePicker
                  value={editedData.doj ? dayjs(editedData.doj) : null}
                  onChange={(date) => handleDateChange("doj", date)}
                  style={{ width: "100%" }}
                />
              ) : (
                selectedMember.doj
              )}
            </Descriptions.Item>

            <Descriptions.Item label="DOB">
              {isEditing ? (
                <DatePicker
                  value={editedData.dob ? dayjs(editedData.dob) : null}
                  onChange={(date) => handleDateChange("dob", date)}
                  style={{ width: "100%" }}
                />
              ) : (
                selectedMember.dob
              )}
            </Descriptions.Item>

            <Descriptions.Item label="About">
              {isEditing ? (
                <Input.TextArea
                  rows={4}
                  value={editedData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                />
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {selectedMember.about}
                </div>
              )}
            </Descriptions.Item>
          </Descriptions>

          {/* Edit mode buttons */}
          {isEditing && (
            <div className="p-3 flex gap-2 mt-4">
              <Button onClick={handleCancel} danger className="w-1/2">
                Cancel
              </Button>
              <Button onClick={handleSave} type="primary" className="w-1/2">
                Save
              </Button>
            </div>
          )}

          {/* HR actions (only visible when headerFlag is true) */}
          {headerFlag && !isEditing && (
            <div className="p-3 flex gap-2 mt-4">
              <Button onClick={handleRemove} danger className="w-1/2">
                Remove
              </Button>
              <Button
                onClick={handleUpdate}
                ghost
                type="primary"
                className="w-1/2"
              >
                Update
              </Button>
            </div>
          )}
        </>
      )}
    </AntDrawer>
  );
};

const TeamManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOk = () => setOpen(false);

  const context = useContext(AppContext);
  const email = context?.email || "";
  const headerFlag = context?.headerFlag || false;
  const setHeaderFlag = context?.setHeaderFlag || (() => {});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } })
  );

  const columns = [
    {
      title: "Profile Picture",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (url) => (
        <Image
          width={50}
          src={url}
          alt="Profile"
          fallback="/default-avatar.png"
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    { title: "Team", dataIndex: "team", key: "team" },
    { title: "Date of Joining", dataIndex: "doj", key: "doj" },
    { title: "DOB", dataIndex: "dob", key: "dob" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <RightCircleOutlined
          className="action-arrow"
          style={{ fontSize: 24, color: "#1890ff", cursor: "pointer" }}
          onClick={() => {
            setSelectedMember(record);
            setIsDrawerVisible(true);
          }}
        />
      ),
    },
  ];

  const handleUpdateMember = (updatedMember) => {
    setDataSource((prev) =>
      prev.map((member) =>
        member.key === updatedMember.key ? updatedMember : member
      )
    );
    console.log("Member updated:", updatedMember);
  };

  const handleRemoveMember = (memberToRemove) => {
    setDataSource((prev) =>
      prev.filter((member) => member.key !== memberToRemove.key)
    );
    console.log("Member removed:", memberToRemove);
  };

useEffect(() => {
  const fetchTeamData = async () => {
    setLoading(true);
    
    try {
      // Method 2: HTTP with CORS enabled
      const response = await fetch("http://team-api.socialbeat.in/api/team/get", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({}),
        mode: 'cors', // CORS enabled
      });
      
      const data = await response.json();
      
      // Your transformation logic
      const transformedData = [];
      const allTeam = data.teams?.find((team) => team.name === "All");
      
      if (allTeam?.members) {
        allTeam.members.forEach((member) => {
          const m = member.memberID;
          if (m) {
            // Check if current user is HR
            if (m.email === email && m.team?.some((t) => t.name === "HR & Finance")) {
              setHeaderFlag(true);
            }
            
            transformedData.push({
              key: m._id,
              name: m.name || "",
              email: m.email || "",
              designation: m.designationText || m.designation || "",
              doj: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "",
              team: m.team && m.team.length > 0 
                ? m.team.map((t) => t.name).join(", ") 
                : allTeam.name,
              dob: m.dob || "N/A",
              profilePicture: m.profilePicture || "",
              about: m.bio || "N/A",
            });
          }
        });
      }
      
      setDataSource(transformedData);
      console.log("✅ Team data fetched successfully");
      
    } catch (error) {
      console.error("❌ Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTeamData();
}, [email, setHeaderFlag]);


  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const oldIndex = prev.findIndex((i) => i.key === active.id);
        const newIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <Header />
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={dataSource.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className="p-6">
            <Table
              components={{ body: { row: Row } }}
              rowKey="key"
              pagination={true}
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              style={{ borderRadius: "12px", overflow: "hidden" }}
            />
          </div>
        </SortableContext>
      </DndContext>

      <ProfileDrawer
        selectedMember={selectedMember}
        isDrawerVisible={isDrawerVisible}
        setIsDrawerVisible={setIsDrawerVisible}
        email={email}
        headerFlag={headerFlag}
        onUpdateMember={handleUpdateMember}
        onRemoveMember={handleRemoveMember}
        onOpenModal={handleOpen}
      />

      <CustomModal
        open={open}
        onOk={handleOk}
        onCancel={handleClose}
        selectedMember={selectedMember}
      />
    </>
  );
};

export default TeamManagement;
