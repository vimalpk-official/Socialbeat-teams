import React, { useEffect, useContext } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  ConfigProvider,
  message,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createStyles, useTheme } from "antd-style";
import dayjs from "dayjs";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { API_ENDPOINT } from "../entities/Endpoint";

// Styles
const useStyle = createStyles(({ token }) => ({
  "my-modal-mask": {
    boxShadow: `inset 0 0 15px #fff`,
  },
  "my-modal-header": {
    borderBottom: `1px dotted ${token.colorPrimary}`,
  },
  "my-modal-footer": {
    color: token.colorPrimary,
  },
  "my-modal-content": {
    border: "1px solid #333",
  },
}));

const CustomModal = ({ open, onOk, onCancel, selectedMember }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const { notificationqueue, setnotificationqueue } = useContext(AppContext);
  const [form] = Form.useForm();
  const { styles } = useStyle();
  const token = useTheme();

  const teams = [
    { name: "Business Development", id: "634eefb4b35a8abf6acbdd3c" },
    { name: "Design & UX", id: "634eefb4b35a8abf6acbdd32" },
    { name: "HR & Finance", id: "634eefb4b35a8abf6acbdd3a" },
    { name: "Media Planning", id: "634eefb4b35a8abf6acbdd30" },
    { name: "SEO & Content", id: "634eefb4b35a8abf6acbdd38" },
    { name: "Sales Force", id: "634eefb4b35a8abf6acbdd3e" },
    { name: "Social", id: "634eefb4b35a8abf6acbdd2e" },
    { name: "Strategy", id: "634eefb4b35a8abf6acbdd36" },
    { name: "Technology", id: "634eefb4b35a8abf6acbdd2c" },
    { name: "Video", id: "634eefb4b35a8abf6acbdd34" },
  ];

  // Helper function to check if string is base64
  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const getImageUrl = (profilePicture) => {
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

  // Function to remove member from notification queue
  const handleDelete = (key) => {
    console.log("Deleting from notification queue, key:", key);
    setnotificationqueue((prevQueue) => {
      const newQueue = prevQueue.filter((item) => {
        const itemKey = item.key || item._id || item.id;
        return itemKey !== key;
      });
      console.log(
        "Queue before:",
        prevQueue.length,
        "Queue after:",
        newQueue.length
      );
      return newQueue;
    });
  };

  // Fixed process team data function
  const processTeamData = (teamData) => {
    console.log("Processing team data:", teamData);

    if (!teamData) return [];

    // Handle array of team objects
    if (Array.isArray(teamData)) {
      return teamData
        .map((teamItem) => {
          // If teamItem is an object with name or _id
          if (typeof teamItem === "object") {
            const teamName = teamItem.name || teamItem;
            const matchingTeam = teams.find((t) => t.name === teamName);
            return matchingTeam ? matchingTeam.id : null;
          }
          // If teamItem is a string
          const matchingTeam = teams.find((t) => t.name === teamItem);
          return matchingTeam ? matchingTeam.id : null;
        })
        .filter(Boolean);
    }

    // Handle string (comma-separated team names)
    if (typeof teamData === "string") {
      const teamNames = teamData.split(",").map((name) => name.trim());
      return teamNames
        .map((name) => {
          const matchingTeam = teams.find(
            (t) => t.name.toLowerCase() === name.toLowerCase()
          );
          return matchingTeam ? matchingTeam.id : null;
        })
        .filter(Boolean);
    }

    // Handle single team object
    if (typeof teamData === "object") {
      const teamName = teamData.name || teamData;
      const matchingTeam = teams.find((t) => t.name === teamName);
      return matchingTeam ? [matchingTeam.id] : [];
    }

    return [];
  };

  useEffect(() => {
    if (selectedMember) {
      console.log("Selected member:", selectedMember);

      const imageUrl = getImageUrl(selectedMember?.profilePicture);

      const profilePicFileList = imageUrl
        ? [
            {
              uid: "-1",
              name: "profile.png",
              status: "done",
              url: imageUrl,
              thumbUrl: imageUrl,
              isExisting: true,
            },
          ]
        : [];

      const teamValue = processTeamData(selectedMember?.team);
      console.log("Processed team value:", teamValue);

      form.setFieldsValue({
        key: selectedMember?.key || selectedMember?._id || selectedMember?.id,
        name: selectedMember?.name || "",
        email: selectedMember?.email || "",
        designation: selectedMember?.designation || "",
        designationText:
          selectedMember?.designationText || selectedMember?.designation || "",
        doj: selectedMember?.doj
          ? dayjs(selectedMember?.doj, "DD/MM/YYYY")
          : null,
        about:
          selectedMember?.about ||
          selectedMember?.content ||
          selectedMember?.bio ||
          "",
        team: teamValue,
        dob:
          selectedMember?.dob && selectedMember?.dob !== "N/A"
            ? dayjs(selectedMember?.dob, "DD/MM/YYYY")
            : null,
        yoe: selectedMember?.yoe || "",
        profilePic: profilePicFileList,
        teamSlugs: selectedMember?.teamSlugs || [],
      });
    } else {
      form.resetFields();
    }
  }, [selectedMember, form]);

  // Handle Add operations
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values for add:", values);

      const formData = new FormData();

      // Required fields validation
      if (!values.name?.trim()) {
        message.error("Name is required");
        return;
      }
      // if (!values.email?.trim()) {
      //   message.error("Email is required");
      //   return;
      // }
      if (!values.designation?.trim()) {
        message.error("Designation is required");
        return;
      }
      // if (!values.doj) {
      //   message.error("Date of joining is required");
      //   return;
      // }
      if (!values.team || values.team.length === 0) {
        message.error("Please select at least one team");
        return;
      }
      // if (!values.dob) {
      //   message.error("Date of birth is required");
      //   return;
      // }
      // if (!String(values.yoe).trim()) {
      //   message.error("Years of experience is required");
      //   return;
      // }

      formData.append("name", values.name.trim());
      formData.append("email", values.email?.trim()?.toLowerCase() || "");
      formData.append("designation", values.designation.trim());
      formData.append(
        "designationText",
        values.designationText || values.designation
      );
      formData.append("doj", values.doj?.format("DD/MM/YYYY") || "");
      formData.append("dob", values.dob?.format("DD/MM/YYYY") || "");
      formData.append("content", values.about || "");
      formData.append("yoe", values.yoe ? String(values.yoe).trim() : "");

      // Check if teams is defined and is an array
      if (!Array.isArray(teams)) {
        message.error("Team list is not available");
        return;
      }

      if (values.team && Array.isArray(values.team)) {
        const selectedTeams = values.team.map((teamId) => {
          const teamObj = teams.find((t) => t.id === teamId);
          return {
            _id: teamId,
            name: teamObj ? teamObj.name : teamId,
          };
        });

        console.log("Selected teams for add:", selectedTeams);

        formData.append("team", JSON.stringify(selectedTeams));

        values.team.forEach((teamId, index) => {
          formData.append(`teamIds[${index}]`, teamId);
          const teamName = teams.find((t) => t.id === teamId)?.name || teamId;
          formData.append(`teamNames[${index}]`, teamName);
        });
      }

      const fileItem = values.profilePic?.[0];
      if (fileItem?.originFileObj) {
        const file = fileItem.originFileObj;

        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
          message.error(
            "Invalid file type. Please upload JPG, PNG, or GIF files only."
          );
          return;
        }

        if (file.size > maxSize) {
          message.error(
            "File size too large. Please upload files smaller than 5MB."
          );
          return;
        }

        formData.append("profilePic", file);
      }

      // Debug: Log FormData contents
      console.log("FormData contents for ADD:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Make API call
      const response = await axios.post(`${API_ENDPOINT}/save/data`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data.success) {
        message.success("Member added successfully!");
        form.resetFields();

        messageApi.success({
          content: "Member Added successfully.",
        });

        if (onCancel) onCancel(); // Close modal
        if (onOk) onOk(); // Optional callback
      } else {
        message.error(response.data.message || "Failed to add member");
      }
    } catch (err) {
      console.error("Add operation error:", err);

      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else if (err.message) {
        message.error(err.message);
      } else {
        message.error("Failed to add member");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values for update:", values);

      const formData = new FormData();

      // ✅ Required Field Validations
      if (!values.key) {
        message.error("Member key is missing");
        return;
      }
      if (!values.name?.trim()) {
        message.error("Name is required");
        return;
      }
      if (!values.designation?.trim()) {
        message.error("Designation is required");
        return;
      }
      if (!values.team || values.team.length === 0) {
        message.error("Please select at least one team");
        return;
      }

      // ✅ Append Required Fields
      formData.append("importance", values.key);
      formData.append("name", values.name.trim());
      formData.append("designation", values.designation.trim());
      formData.append(
        "designationText",
        values.designationText || values.designation.trim()
      );
      formData.append("about", values.about || "");

      // ✅ Optional Fields (set to "" or null safely)
      formData.append("email", values.email?.trim().toLowerCase() || "");
      formData.append("doj", values.doj?.format("DD/MM/YYYY") || "");

      formData.append("dob", values.dob ? values.dob.format("DD/MM/YYYY") : "");
      formData.append(
        "yoe",
        values.yoe !== undefined ? String(values.yoe).trim() : ""
      );

      // ✅ Team Info Handling
      if (Array.isArray(values.team)) {
        const selectedTeams = values.team.map((teamId) => {
          const teamObj = teams.find((t) => t.id === teamId);
          return {
            _id: teamId,
            name: teamObj ? teamObj.name : teamId,
          };
        });

        formData.append("team", JSON.stringify(selectedTeams));
        selectedTeams.forEach((team, index) => {
          formData.append(`teamIds[${index}]`, team._id);
          formData.append(`teamNames[${index}]`, team.name);
        });
      }

      // ✅ Team Slugs (if available)
      if (Array.isArray(values.teamSlugs)) {
        formData.append("teamSlugs", JSON.stringify(values.teamSlugs));
      }

      // ✅ Profile Picture Validation
      const fileList = values.profilePic;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj) {
          const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
          ];
          const maxSize = 5 * 1024 * 1024;

          if (!allowedTypes.includes(file.originFileObj.type)) {
            message.error("Invalid file type. Only JPG, PNG, or GIF allowed.");
            return;
          }

          if (file.originFileObj.size > maxSize) {
            message.error("File size too large. Max 5MB allowed.");
            return;
          }

          formData.append("profilePic", file.originFileObj);
        } else if (file.url && !file.isExisting) {
          formData.append("profilePicUrl", file.url);
        }
      }

      // 🔍 Debug
      console.log("Final FormData for update:");
      for (let [key, val] of formData.entries()) {
        console.log(`${key}: ${val}`);
      }

      // 🚀 API Call
      const response = await axios.post(
        `${API_ENDPOINT}/update/member`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      if (response.data.success !== false) {
        message.success("Member updated successfully");

        // Optionally remove from queue
        handleDelete(values.key);

        // Close modal
        if (onCancel) onCancel();

        messageApi.success({
          content: "Member updated successfully.",
        });

        if (onOk) onOk();
      } else {
        message.error(response.data.message || "Failed to update member");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error(err.message || "Update failed");
      }
    }
  };

  const handleModalCancel = () => {
    if (onCancel) onCancel();
  };

  const handleModalOk = () => {
    if (selectedMember) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const classNames = {
    body: styles["my-modal-body"],
    mask: styles["my-modal-mask"],
    header: styles["my-modal-header"],
    footer: styles["my-modal-footer"],
    content: styles["my-modal-content"],
  };

  const modalStyles = {
    mask: {
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    content: {
      boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    },
    header: {
      borderBottom: `1px solid ${token.colorPrimary}`,
      paddingInlineStart: 12,
    },
    footer: {
      borderTop: "1px solid #eee",
    },
  };

  return (
    <>
      {contextHolder}

      <ConfigProvider modal={{ classNames, styles: modalStyles }}>
        <Modal
          title={<h1>{selectedMember ? "Update Member" : "Add Member"}</h1>}
          open={open}
          centered
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          maskClosable={false}
          keyboard={false}
          destroyOnClose
          footer={[
            <Button
              key="submit"
              className="!mt-3"
              ghost
              type="primary"
              onClick={handleModalOk}
            >
              {selectedMember ? "Update Member" : "Add Member"}
            </Button>,
          ]}
        >
          <Form layout="vertical" form={form}>
            {selectedMember && (
              <Form.Item name="key" hidden>
                <Input />
              </Form.Item>
            )}

            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input name!" },
                { min: 2, message: "Name must be at least 2 characters!" },
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: false, message: "Please input email!" },
                { type: "email", message: "Please enter a valid email!" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (
                      value.endsWith("@socialbeat.in") ||
                      value.endsWith("@influencer.in")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Email must be from socialbeat.in or influencer.in domain"
                      )
                    );
                  },
                },
              ]}
            >
              <Input placeholder="example@socialbeat.in or example@influencer.in" />
            </Form.Item>

            <Form.Item
              label="Designation"
              name="designation"
              rules={[
                { required: true, message: "Please input designation!" },
                {
                  min: 2,
                  message: "Designation must be at least 2 characters!",
                },
              ]}
            >
              <Input placeholder="Enter designation" />
            </Form.Item>

            <Form.Item
              label="Date of Joining"
              name="doj"
              rules={[
                { required: false, message: "Please select date of joining!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Select date of joining"
              />
            </Form.Item>

            <Form.Item label="About" name="about">
              <Input.TextArea
                rows={3}
                placeholder="Brief description about the member"
                showCount
              />
            </Form.Item>

            <Form.Item
              label="Team"
              name="team"
              rules={[
                { required: true, message: "Please select at least one team!" },
              ]}
            >
              <Select
                mode="tags"
                placeholder="Select or type team(s)"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {teams.map((team) => (
                  <Select.Option key={team.id} value={team.id}>
                    {team.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[
                { required: false, message: "Please select date of birth!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Select date of birth"
              />
            </Form.Item>

            <Form.Item
              label="Years of Experience"
              name="yoe"
              rules={[
                {
                  required: false,
                  message: "Please input years of experience!",
                },
                {
                  pattern: /^\d+(\.\d+)?$/,
                  message: "Please enter a valid number!",
                },
              ]}
            >
              <Input placeholder="Enter years of experience (e.g., 2.5)" />
            </Form.Item>

            {selectedMember && (
              <Form.Item name="teamSlugs" hidden>
                <Input />
              </Form.Item>
            )}

            <Form.Item
              label="Profile Picture"
              name="profilePic"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList || [];
              }}
            >
              <Upload
                listType="picture"
                accept=".png,.jpg,.jpeg,.gif"
                maxCount={1}
                beforeUpload={(file) => {
                  const isImage = [
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/gif",
                  ].includes(file.type);

                  if (!isImage) {
                    message.error(
                      "Only PNG, JPEG, JPG, and GIF files are allowed!"
                    );
                    return Upload.LIST_IGNORE;
                  }

                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error("Image must be smaller than 5MB!");
                    return Upload.LIST_IGNORE;
                  }

                  return false; // prevent auto upload
                }}
                onRemove={() => {
                  console.log("Image removed");
                  return true;
                }}
              >
                <Button icon={<UploadOutlined />}>
                  Click to Upload Profile Picture
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default CustomModal;
