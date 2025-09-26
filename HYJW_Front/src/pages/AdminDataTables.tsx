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
    <Box sx={{ width: "100%" }}>
      {/* 상단 탭 메뉴 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="관리자 데이터 테이블 탭">
          <Tab label="게시글 관리" />
          <Tab label="댓글 관리" />
          <Tab label="회원 관리" />
        </Tabs>
      </Box>

      {/* 탭별 콘텐츠 */}
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
  );
}