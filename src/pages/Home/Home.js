import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DatePicker } from "antd";

import {
  Menu,
  Table,
  Image,
  Drawer as AntDrawer,
  Descriptions,
  Button,
  Upload,
  Input,
  Tag,
  message,
  AutoComplete,
  Dropdown,
  Space,
} from "antd";
import {
  RightCircleOutlined,
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import CustomModal from "../../components/Modal";
import Header from "../../components/Header";
import "./Home.css";
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
import { AppContext } from "../../context/AppContext";
import { API_ENDPOINT } from "../../entities/Endpoint";

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
const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture) return "";

  try {
    if (typeof profilePicture === "string") {
      if (profilePicture.length > 100) {
        return `data:image/jpeg;base64,${profilePicture}`;
      }
      return profilePicture;
    }

    if (typeof profilePicture === "object") {
      if (profilePicture.data && profilePicture.contentType) {
        return `data:${profilePicture.contentType};base64,${profilePicture.data}`;
      }
      if (typeof profilePicture.url === "string") {
        return profilePicture.url;
      }
      if (typeof profilePicture.src === "string") {
        return profilePicture.src;
      }
    }

    return "";
  } catch (error) {
    console.error("Error generating profile picture URL:", error);
    return "";
  }
};

const isValidImageFile = (file) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    message.error("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
    return false;
  }

  if (file.size > maxSize) {
    message.error("Image size should be less than 5MB");
    return false;
  }

  return true;
};

const ProfileDrawer = ({
  selectedMember,
  isDrawerVisible,
  setIsDrawerVisible,
  email,
  headerFlag,
  onUpdateMember,
  onRemoveMember,
  onOpenModal,
  messageApi,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [imageChanged, setImageChanged] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { setnotificationqueue } = useContext(AppContext);

  useEffect(() => {
    if (selectedMember) {
      const memberData = { ...selectedMember };
      setEditedData(memberData);
      setOriginalData(memberData);
      setImageChanged(false);
    }
  }, [selectedMember]);

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file || !isValidImageFile(file)) {
      return;
    }

    setUploadLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
        setImageChanged(true);
        setUploadLoading(false);
      };
      reader.onerror = () => {
        message.error("Failed to read image file");
        setUploadLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      message.error("Error uploading image");
      setUploadLoading(false);
    }
  };

  const handleImageRemove = () => {
    setEditedData((prev) => ({
      ...prev,
      profilePicture: "",
    }));
    setImageChanged(true);
  };

  const handleSave = async () => {
    try {
      const hrRequestData = {
        ...editedData,
        requestType: "profile_update",
        requestedBy: email,
        requestedAt: new Date().toISOString(),
        originalData: originalData,
        changes: {},
      };

      Object.keys(editedData).forEach((key) => {
        if (editedData[key] !== originalData[key]) {
          hrRequestData.changes[key] = {
            from: originalData[key],
            to: editedData[key],
          };
        }
      });

      messageApi.success({
        content: "Profile update request sent to HR successfully.",
      });

      setnotificationqueue((prev) => [...prev, hrRequestData]);

      setIsEditing(false);
      setImageChanged(false);
      setIsDrawerVisible(false);

      setEditedData(originalData);
    } catch (error) {
      message.error("Failed to send request to HR");
    }
  };

  const handleUpdate = () => {
    if (onOpenModal) {
      onOpenModal(selectedMember);
    }
  };

  const handleCancel = () => {
    setEditedData({ ...originalData });
    setIsEditing(false);
    setImageChanged(false);
  };

  const handleRemove = async () => {
    if (!selectedMember) return;

    const memberKey =
      selectedMember.key || selectedMember._id || selectedMember.memberID?._id;
    if (!memberKey) {
      message.error("Invalid member data");
      return;
    }

    try {
      await axios.delete(`${API_ENDPOINT}/delete/member`, {
        data: { key: memberKey },
      });

      if (onRemoveMember) {
        onRemoveMember(selectedMember);
      }

      messageApi.success({
        content: "Member deleted successfully.",
      });

      setIsDrawerVisible(false);
    } catch (error) {
      message.error("Failed to remove member");
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
        setEditedData(originalData);
        setImageChanged(false);
      }}
      classNames={classNames}
      styles={drawerStyles}
      width={500}
    >
      {selectedMember && (
        <>
          <div className="flex justify-between items-start w-full mb-4">
            <div></div>
            {email === selectedMember.email && !isEditing && (
              <div
                className="flex items-center text-[#1890ff] cursor-pointer"
                onClick={() => {
                  setIsEditing(true);
                  setEditedData({ ...selectedMember });
                  setOriginalData({ ...selectedMember });
                }}
              >
                <button className="flex items-center border-2 border-[#8888] p-[5px] rounded-md ">
                  <EditOutlined style={{ fontSize: 20 }} />
                  <span className="ml-2">Edit</span>
                </button>
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
                    beforeUpload={() => false}
                    onChange={handleImageUpload}
                    disabled={uploadLoading}
                    accept="image/*"
                  >
                    {editedData.profilePicture ? (
                      <div style={{ position: "relative" }}>
                        <Image
                          width={100}
                          className="!p-2"
                          src={getProfilePictureUrl(
                            selectedMember?.profilePicture
                          )}
                          alt="Profile"
                          fallback="/default-avatar.png"
                        />

                        {uploadLoading && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "rgba(0,0,0,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            Loading...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>
                          {uploadLoading ? "Uploading..." : "Upload"}
                        </div>
                      </div>
                    )}
                  </Upload>
                  {editedData.profilePicture && (
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={handleImageRemove}
                      style={{ marginTop: 8 }}
                      disabled={uploadLoading}
                    >
                      Remove
                    </Button>
                  )}
                  {imageChanged && (
                    <div
                      style={{
                        marginTop: 8,
                        color: "#ff4d4f",
                        fontSize: "12px",
                      }}
                    >
                      * Image will be updated after HR approval
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Image
                    width={100}
                    className="!p-2"
                    src={getProfilePictureUrl(selectedMember?.profilePicture)}
                    alt="Profile"
                    fallback="/default-avatar.png"
                  />
                </div>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {selectedMember.email}
            </Descriptions.Item>

            <Descriptions.Item label="YOE">
              {isEditing ? (
                <Input
                  type="number"
                  value={editedData.yoe || ""}
                  onChange={(e) => handleInputChange("yoe", e.target.value)}
                  min={0}
                  step={0.1}
                  placeholder="Enter years of experience"
                />
              ) : (
                selectedMember.yoe || "N/A"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Designation">
              {isEditing ? (
                <Input
                  value={editedData.designation || ""}
                  onChange={(e) =>
                    handleInputChange("designation", e.target.value)
                  }
                />
              ) : (
                selectedMember.designation
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Team">
              {selectedMember.team || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Date of Joining">
              {selectedMember.doj || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="DOB">
              {selectedMember?.memberData.dob || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="About">
              {isEditing ? (
                <Input.TextArea
                  rows={4}
                  value={editedData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                />
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {selectedMember.bio || "No bio available"}
                </div>
              )}
            </Descriptions.Item>
          </Descriptions>

          {isEditing && (
            <div className="p-3 flex gap-2 mt-4">
              <Button onClick={handleCancel} danger className="w-1/2">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                type="primary"
                ghost
                className="w-1/2"
                loading={uploadLoading}
              >
                Save
              </Button>
            </div>
          )}

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
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [selectedTeamSlug, setSelectedTeamSlug] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("634eefb4b35a8abf6acbdd2a");

  const [searchValue, setSearchValue] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allTeamsData, setAllTeamsData] = useState([]);
  const [allMembersData, setAllMembersData] = useState([]);

  const [reorderedDataSource, setReorderedDataSource] = useState([]);

  const {
    currentUser,
    setCurrentUser,
    setnotificationqueue,
    notificationqueue,
    email,
    headerFlag,
    setHeaderFlag,
  } = useContext(AppContext);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } })
  );

  const menuItems = [
    {
      label: "Add member",
      key: "add-member",
      icon: <UserOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items: menuItems,
    onClick: ({ key }) => {
      if (key === "add-member") {
        setIsModalOpen(true);
      }
    },
  };

  const teamColorMap = {
    "HR & Finance": "volcano",
    Technology: "yellow",
    "Media Planning": "red",
    "Business Development": "magenta",
    "Design & UX": "volcano",
    "SEO & Content": "orange",
    "Sales Force": "gold",
    Social: "blue",
    Strategy: "green",
    Video: "cyan",
  };

  const filterMembersBySearch = (members, searchTerm) => {
    if (!searchTerm) return members;

    const lowercaseSearch = searchTerm.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(lowercaseSearch) ||
        member.email.toLowerCase().includes(lowercaseSearch) ||
        member.designation.toLowerCase().includes(lowercaseSearch) ||
        member.team.toLowerCase().includes(lowercaseSearch)
    );
  };

  const handleSearchValueChange = (value) => {
    setSearchTerm(value);
    const filtered = filterMembersBySearch(dataSource, value);
    setFilteredDataSource(filtered);
  };

  const columns = [
    {
      title: "Profile Picture",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (profilePicture, record) => {
        const imageUrl = getProfilePictureUrl(profilePicture);

        return (
          <Image
            src={imageUrl}
            width={50}
            height={50}
            style={{
              objectFit: "cover",
              border: "2px solid #f0f0f0",
            }}
            alt={`${record.name || "User"} Profile`}
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
        );
      },
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
      render: (team) => {
        if (!team) return null;
        const teamList = team.split(",").map((t) => t.trim());
        return (
          <>
            {teamList.map((t) => (
              <Tag
                key={t}
                color={teamColorMap[t] || "default"}
                className="!me-2 !mb-1"
              >
                {t}
              </Tag>
            ))}
          </>
        );
      },
    },
    { title: "Date of Joining", dataIndex: "doj", key: "doj" },
    { title: "DOB", dataIndex: "dob", key: "dob" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.email === email && setCurrentUser) {
          setCurrentUser(record);
        }

        return (
          <RightCircleOutlined
            className="action-arrow"
            style={{ fontSize: 24, color: "#1890ff", cursor: "pointer" }}
            onClick={() => {
              setSelectedMember(record);
              setIsDrawerVisible(true);
            }}
          />
        );
      },
    },
  ];

  const handleUpdateMember = (updatedMember) => {
    const updateMemberInArray = (arr) =>
      arr.map((member) =>
        member.key === updatedMember.key ? updatedMember : member
      );

    setDataSource((prev) => updateMemberInArray(prev));
    setAllMembersData((prev) => updateMemberInArray(prev));
    setFilteredDataSource((prev) => updateMemberInArray(prev));
    setReorderedDataSource((prev) => updateMemberInArray(prev));

    // Update selected member if it's the same
    if (selectedMember && selectedMember.key === updatedMember.key) {
      setSelectedMember(updatedMember);
    }

    // Update current user if it's the same
    if (currentUser && currentUser.key === updatedMember.key) {
      setCurrentUser(updatedMember);
    }
  };

  const handleRemoveMember = (memberToRemove) => {
    const removeMemberFromArray = (arr) =>
      arr.filter((member) => member.key !== memberToRemove.key);

    setDataSource((prev) => removeMemberFromArray(prev));
    setAllMembersData((prev) => removeMemberFromArray(prev));
    setFilteredDataSource((prev) => removeMemberFromArray(prev));
    setReorderedDataSource((prev) => removeMemberFromArray(prev));
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleOk = () => setOpen(false);

  const processHRNotifications = useCallback(async () => {
    if (!notificationqueue || notificationqueue.length === 0) return;

    for (const notification of notificationqueue) {
      if (
        notification.requestType === "profile_update" &&
        notification.approved
      ) {
        try {
          const memberKey = notification.key || notification._id;

          const response = await axios.post(`${API_ENDPOINT}/update/member`, {
            key: memberKey,
            ...notification,
          });

          if (response.data.success) {
            handleUpdateMember(notification);

            setnotificationqueue((prev) =>
              prev.filter((item) => item.key !== notification.key)
            );

            messageApi.success({
              content: `Profile updated for ${notification.name}`,
            });
          }
        } catch (error) {
          messageApi.error({
            content: `Failed to update profile for ${notification.name}`,
          });
        }
      }
    }
  }, [notificationqueue, handleUpdateMember, setnotificationqueue, messageApi]);

  useEffect(() => {
    if (headerFlag) {
      processHRNotifications();
    }
  }, [headerFlag, processHRNotifications]);

  const fetchTeamData = async (teamId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_ENDPOINT}/get/team`, {
        id: teamId,
      });

      const members = res.data?.members || [];

      console.log(members, "hhhhh h");
      const parseDDMMYYYY = (dateStr) => {
        if (!dateStr || typeof dateStr !== "string") return null;
        const [day, month, year] = dateStr.split("/");
        if (!day || !month || !year) return null;

        const date = new Date(`${year}-${month}-${day}`);
        return isNaN(date.getTime()) ? null : date;
      };

      const formatDate = (dateObj, locale = "en-GB") => {
        return dateObj?.toLocaleDateString(locale) || "N/A";
      };

      const transformedData = members.map((member, index) => {
        const memberData = member.memberID || {};

        // Parse and format DOB
        const rawDob = memberData.dob;
        const parsedDob = parseDDMMYYYY(rawDob);
        const formattedDob = parsedDob ? formatDate(parsedDob, "en-GB") : "N/A";

        // Parse and format DOJ
        const dojDate = new Date(memberData.doj);
        const formattedDoj = !isNaN(dojDate.getTime())
          ? dojDate.toLocaleDateString("en-GB")
          : "N/A";

        return {
          key: memberData._id || index.toString(),
          name: memberData.name || "N/A",
          email: memberData.email || "N/A",
          designation:
            memberData.designationText || memberData.designation || "N/A",
          team: Array.isArray(memberData.team)
            ? memberData.team.map((team) => team.name || team).join(", ")
            : "No Teams",
          isActive: memberData.isActive ?? true,
          profilePicture: memberData.profilePicture,
          bio: memberData.bio || "",
          yoe: parseInt(memberData.yoe) || 0,
          doj: formattedDoj,
          dob: formattedDob,
          createdAt: memberData.createdAt,
          memberData: memberData,
        };
      });

      setDataSource(transformedData);
      setFilteredDataSource(transformedData);
      setReorderedDataSource(transformedData);
    } catch (err) {
      console.error("Fetch error", err);
      message.error("Could not load team data.");
      setDataSource([]);
      setFilteredDataSource([]);
      setReorderedDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = reorderedDataSource.findIndex(
      (item) => item.key === active.id
    );
    const newIndex = reorderedDataSource.findIndex(
      (item) => item.key === over.id
    );

    const reorderedData = arrayMove(reorderedDataSource, oldIndex, newIndex);

    const updatedData = reorderedData.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    console.log("🔄 Drag finished in team:", selectedTeamSlug);
    console.log("📦 Fully updated data to send:", updatedData);

    sendPositionChangeToBackend(updatedData, selectedTeamSlug);
    setReorderedDataSource(updatedData);
  };

  const sendPositionChangeToBackend = async (reorderedList, teamSlug) => {
    const payload = {
      team: teamSlug,
      members: reorderedList,
    };

    try {
      const response = await axios.post(`${API_ENDPOINT}/position/change`, payload);
      messageApi.success({
        content: `Position updated successfully`,
      });

      console.log("Backend response:", response.data);
    } catch (error) {
      console.error("Failed to send reordered data:", error);
    }
  };

  const options = useMemo(() => {
    if (!Array.isArray(filteredDataSource)) return [];

    return filteredDataSource
      .filter((member) => member && member.name)
      .map((member) => ({
        value: member.name,
        label: member.name,
        key: member.key || member.name,
      }));
  }, [filteredDataSource]);

  const onSearch = useCallback(
    (value) => {
      if (!value || !value.trim()) {
        message.warning("Please enter a search term");
        return;
      }

      const selected = filteredDataSource?.find(
        (member) =>
          member &&
          member.name &&
          member.name.toLowerCase().trim() === value.toLowerCase().trim()
      );

      if (selected) {
        setSelectedMember(selected);
        setIsDrawerVisible(true);
        setSearchValue("");
      } else {
        message.info("No matching member found");
      }
    },
    [filteredDataSource, setSelectedMember, setIsDrawerVisible]
  );

  const handleViewProfile = useCallback(() => {
    if (currentUser) {
      setSelectedMember(currentUser);
      setIsDrawerVisible(true);
    } else {
      message.info("Current user profile not available");
    }
  }, [currentUser, setSelectedMember, setIsDrawerVisible]);
  const items = [
    { label: "All", key: "634eefb4b35a8abf6acbdd2a" },
    { label: "Business Development", key: "634eefb4b35a8abf6acbdd3c" },
    { label: "Design & UX", key: "634eefb4b35a8abf6acbdd32" },
    { label: "HR & Finance", key: "634eefb4b35a8abf6acbdd3a" },
    { label: "Media Planning", key: "634eefb4b35a8abf6acbdd30" },
    { label: "SEO & Content", key: "634eefb4b35a8abf6acbdd38" },
    { label: "Sales Force", key: "634eefb4b35a8abf6acbdd3e" },
    { label: "Social", key: "634eefb4b35a8abf6acbdd2e" },
    { label: "Strategy", key: "634eefb4b35a8abf6acbdd36" },
    { label: "Technology", key: "634eefb4b35a8abf6acbdd2c" },
    { label: "Video", key: "634eefb4b35a8abf6acbdd34" },
  ];

  const handleTeamMenuClick = async (e) => {
    const teamId = e.key;
    const selectedItem = items.find((item) => item.key === teamId);

    setSelectedTeam(teamId);
    setSelectedTeamSlug(selectedItem ? selectedItem.key : "All");
    await fetchTeamData(teamId);
  };
  useEffect(() => {
    fetchTeamData(selectedTeam);
  }, []); // Only run on mount

  return (
    <>
      <Header
        currentUser={currentUser}
        setSelectedMember={setSelectedMember}
        setIsDrawerVisible={setIsDrawerVisible}
        filteredMembers={filteredDataSource}
        onSearchValueChange={handleSearchValueChange}
      />

      <div className="grid grid-cols-12">
        <div className="col-span-2">
          <Menu
            onClick={handleTeamMenuClick}
            mode="vertical"
            theme="dark"
            style={{
              width: "100%",
              height: "88vh",
            }}
            items={items}
            selectedKeys={[selectedTeam]}
            className="custom-center-menu !text-start"
          />
        </div>

        <div className="col-span-10 col-start-3 overflow-y-auto h-[88vh]">
          <div className="p-4 bg-[#333] !border-3 mx-auto rounded-lg !mt-3 !ml-3 !mr-3 !mb-2 flex">
            <div className="!me-3 !w-full">
              <AutoComplete
                options={options}
                style={{ width: "100%" }}
                value={searchValue}
                onChange={(value) => setSearchValue(value)}
                onSelect={(value) => {
                  setSearchValue(value);
                  onSearch(value);
                }}
                filterOption={(inputValue, option) =>
                  option?.value
                    ?.toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                placeholder="Search filtered members"
              >
                <Input.Search
                  placeholder="Search filtered members"
                  enterButton
                  allowClear
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={(value) => {
                    onSearch(value);
                  }}
                  style={{ width: "100%" }}
                />
              </AutoComplete>
            </div>

            <div className="!me-3">
              <Button
                size="medium"
                className="text-base ml-4"
                onClick={handleViewProfile}
              >
                View Profile
              </Button>
            </div>
            <div>
              {headerFlag && (
                <Dropdown menu={menuProps} trigger={["click"]}>
                  <Button className="ml-4">
                    <Space>
                      Menu
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              )}
            </div>
          </div>

          {headerFlag ? (
            <DndContext
              sensors={sensors}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={reorderedDataSource.map((i) => i.key)}
                strategy={verticalListSortingStrategy}
              >
                <div className="py-2 px-3">
                  <Table
                    components={{ body: { row: Row } }}
                    rowKey="key"
                    pagination={false}
                    columns={columns}
                    dataSource={reorderedDataSource}
                    loading={loading}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #ccc",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="py-2 px-3">
              <Table
                rowKey="key"
                pagination={false}
                columns={columns}
                dataSource={reorderedDataSource}
                loading={loading}
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
          <ProfileDrawer
            selectedMember={selectedMember}
            isDrawerVisible={isDrawerVisible}
            setIsDrawerVisible={setIsDrawerVisible}
            email={email}
            headerFlag={headerFlag}
            onUpdateMember={handleUpdateMember}
            onRemoveMember={handleRemoveMember}
            onOpenModal={handleOpen}
            messageApi={messageApi}
          />
        </div>
      </div>

      <CustomModal
        open={open}
        onOk={handleOk}
        onCancel={handleClose}
        selectedMember={selectedMember}
      />

      <CustomModal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      />
      {contextHolder}
    </>
  );
};

export default TeamManagement;
