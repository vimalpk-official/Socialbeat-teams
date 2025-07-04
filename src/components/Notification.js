import { Drawer, Card, Button } from "antd";
import { createStyles, useTheme } from "antd-style";
import { DeleteOutlined } from "@ant-design/icons";

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

  // Class names applied to drawer parts
  const classNames = {
    body: styles["my-drawer-body"],
    mask: styles["my-drawer-mask"],
    header: styles["my-drawer-header"],
    footer: styles["my-drawer-footer"],
    content: styles["my-drawer-content"],
  };

  // Inline style overrides
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

  return (
    <Drawer
      title="Notifications"
      placement="right"
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
      className="!p-2"
      onClose={onClose}
      open={open}
      classNames={classNames}
      styles={drawerStyles}
    >
      {/* Notification Card */}
      <Card
        className="relative mb-3"
        style={{ width: 350 }}
        bodyStyle={{ padding: 10 }}
      >
        Vimal PK Changed his bio
        <DeleteOutlined
          className="absolute right-3 top-3 text-red-500"
          style={{ fontSize: 20 }}
        />
      </Card>

      {/* Outlined Button styled like Material UI */}
    </Drawer>
  );
};

export default Notification;
