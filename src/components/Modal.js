import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  ConfigProvider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createStyles, useTheme } from "antd-style";
import dayjs from "dayjs";

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
  const [form] = Form.useForm();
  const { styles } = useStyle();
  const token = useTheme();

  useEffect(() => {
    let isMounted = true;

    if (selectedMember && isMounted) {
      form.setFieldsValue({
        name: selectedMember.name || "",
        email: selectedMember.email || "",
        designation: selectedMember.designation || "",
        doj: selectedMember.doj
          ? dayjs(selectedMember.doj, "DD/MM/YYYY")
          : null,
        content: selectedMember.about || selectedMember.bio || "",
        team:
          typeof selectedMember.team === "string"
            ? selectedMember.team
            : selectedMember.team?.map((t) => t.name).join(", ") || "",
        dob:
          selectedMember.dob !== "N/A"
            ? dayjs(selectedMember.dob, "DD/MM/YYYY")
            : null,
        profilePic: selectedMember.profilePicture || "",
      });
    } else {
      form.resetFields();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedMember, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          doj: values.doj ? values.doj.format("DD/MM/YYYY") : "",
          dob: values.dob ? values.dob.format("DD/MM/YYYY") : "",
        };
        onOk(formattedValues);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
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
    <ConfigProvider modal={{ classNames, styles: modalStyles }}>
      <Modal
        title={<h1>{selectedMember ? "Update Member" : "Add Member"}</h1>}
        open={open}
        centered
        onOk={handleOk}
        onCancel={() => {
          onCancel();
          setTimeout(() => {
            form.resetFields();
          }, 300);
        }}
        maskClosable={false}
        keyboard={false}
        destroyOnClose
        footer={[
          <Button
            key="submit"
            className="!mt-3"
            ghost
            type="primary"
            onClick={handleOk}
          >
            {selectedMember ? "Update Member" : "Add Member"}
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of Joining"
            name="doj"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item label="Content" name="content">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Team" name="team" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="DOB" name="dob" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item label="Profile Picture" name="profilePic">
            <Upload
              listType="picture"
              defaultFileList={
                selectedMember?.profilePicture
                  ? [
                      {
                        uid: "-1",
                        name: "profile.png",
                        status: "done",
                        url: selectedMember.profilePicture,
                      },
                    ]
                  : []
              }
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default CustomModal;
