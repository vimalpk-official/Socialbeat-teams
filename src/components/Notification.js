import React, { useState } from "react";
import { Drawer, Card, Button } from "antd";
import { createStyles, useTheme } from "antd-style";
import CustomModal from "./Modal";

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

  const handleOk = (data) => {
    console.log("Modal submitted with data:", data);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const membersData = [
    {
      _id: "634eefb4b35a8abf6acbdd2a",
      name: "All",
      slug: "all",
      members: [
        {
          memberID: {
            _id: "64218920f3c26ff52a73d69d",
            name: "Pavan Ramchand",
            email: "pavan@socialbeat.in",
            isActive: true,
            created_by: "635f7044f3c26ff52acea203",
            profilePicture:
              "https://d1sup9poj2dr2a.cloudfront.net/1724679222486Pavan.png",
            bio: "Pavan comes with close to 2 decades of experience in HR and has spent time with large multinational corporations such as Royal Dutch Shell, Gartner Inc, Rio Tinto, Biocon, and Flex. He brings to the table diverse experience having worked in varied industries such as Oil & Gas, Mining, Pharma, Manufacturing, Research, and IT.\nHe has led large HR teams across APAC and EMEA. Prior to joining Social Beat,he had been closely involved in growing some of the large organisations listed and working with executive committees,board members in building HR strategies/roadmaps and successfully executing them.In his spare time, He enjoys traveling and reading",
            designation: "CHRO",
            team: [{ name: "HR & Finance", _id: "64218920f3c26ff52a73d69e" }],
            designationText: "CHRO",
            createdAt: "2023-03-27T12:16:32.368Z",
            updatedAt: "2024-08-26T13:33:44.100Z",
            __v: 0,
          },
          _id: "67121b30c85f61d666d9ff6c",
        },
        {
          memberID: {
            _id: "66475fdbadc54810028c1b3d",
            name: "Ashish Tambe",
            email: "ashish.tambe@socialbeat.in",
            isActive: true,
            created_by: "63636425f3c26ff52ad34181",
            profilePicture:
              "https://d1sup9poj2dr2a.cloudfront.net/1715953617929400 x 400 copy.png",
            bio: "A creative by accident, a microbiologist by qualification, Ashish believes that the best creatives hinge on the smallest nuances. A decade in, he has experience in crafting pathbreaking creative strategies, manifesting noteworthy campaigns and uplifting brand stories. A proven track record of delivering several award-winning campaigns, including the most revered – Cannes, D&AD, The One Show, he has pushed the advertising boundaries for brands across industries with stories that linger with you.",
            designation: "National Creative Director",
            team: [
              { name: "Video", _id: "66475fdbadc54810028c1b3e" },
              { name: "Design & UX", _id: "66475fdbadc54810028c1b3f" },
            ],
            designationText: "National Creative Director",
            createdAt: "2024-05-17T13:47:07.874Z",
            updatedAt: "2024-05-17T13:47:07.874Z",
            __v: 0,
          },
          _id: "67121b30c85f61d666d9ff6d",
        },
        {
          memberID: {
            _id: "634eefeab35a8abf6acbe3ca",
            name: "PURUSHOTHAMAN K",
            email: "purushothaman@socialbeat.in",
            isActive: true,
            created_by: "634eea47bf0a4511210d3dd5",
            profilePicture:
              "https://d1sup9poj2dr2a.cloudfront.net/1724678700666Puru.png",
            bio: 'Purushothaman has almost two decades of experience in digital, web, and graphic design. He has honed his graphic design skills to create a "wow" effect with ease. Despite handling a heavy workload with quick turnarounds, Purushothaman still lives by his mantra, "Live and make others happy." On weekends, he enjoys playing cricket, watching movies, and driving like the Fast & Furious cast!',
            designation: "Head",
            team: [
              { name: "Design & UX", _id: "634eefeab35a8abf6acbe3cb" },
              { name: "Video", _id: "636ca476f3c26ff52ad8a2e1" },
            ],
            designationText: "Director - Creative",
            createdAt: "2022-10-18T18:26:50.628Z",
            updatedAt: "2024-08-26T13:25:02.533Z",
            __v: 0,
          },
          _id: "67121b30c85f61d666d9ff6e",
        },
        {
          memberID: {
            _id: "634eefeab35a8abf6acbdebe",
            name: "ARUSHI GUPTA",
            email: "arushi@socialbeat.in",
            isActive: true,
            created_by: "634eea47bf0a4511210d3dd5",
            profilePicture:
              "https://d1sup9poj2dr2a.cloudfront.net/1724679434069Arushi.png",
            bio: "Arushi has over 7 years of experience ranging from project management, marketing, and sales and has formerly worked at the British Council and Cambridge English Language Assessment. She enjoys identifying a problem, conceptualizing a solution to execute it. She is a management graduate from the London School of Economics (LSE) and a graduate from Lady Shri Ram College, Delhi (LSR). In her free time, she likes reading, traveling, exploring new restaurants and binge-watching Netflix.",
            designation: "AVP",
            team: [{ name: "Social", _id: "634eefeab35a8abf6acbdebf" }],
            designationText: "Business Head - Influencer.in",
            createdAt: "2022-10-18T18:26:50.180Z",
            updatedAt: "2024-08-26T13:37:15.803Z",
            __v: 0,
          },
          _id: "67121b30c85f61d666d9ff6f",
        },
      ],
    },
  ];

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
      {membersData[0]?.members.map((memberWrapper) => {
        const member = memberWrapper.memberID;
        return (
          <Card
            key={member._id}
            className="relative mb-3 cursor-pointer border border-gray-300 hover:border-blue-500 !mb-1"
            style={{ width: 350 }}
            bodyStyle={{ padding: 10 }}
            onClick={() => handleOpen(member)}
          >
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
                  {member.team.map((t) => t.name).join(", ")}
                </div>
              </div>
            </div>
          </Card>
        );
      })}

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
