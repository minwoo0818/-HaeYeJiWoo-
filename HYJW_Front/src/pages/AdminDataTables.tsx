import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PostTable from "../components/admin/PostTable";
import CommentTable from "../components/admin/CommentTable";
import UserTable from "../components/admin/UserTable";

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDataTables() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="관리자 데이터 테이블 탭"
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: 150 }}
      >
        <Tab label="게시글 관리" />
        <Tab label="댓글 관리" />
        <Tab label="회원 관리" />
      </Tabs>

      <Box sx={{ flexGrow: 1 }}>
        <TabPanel value={value} index={0}>
          <PostTable />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CommentTable />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <UserTable />
        </TabPanel>
      </Box>
    </Box>
  );
}