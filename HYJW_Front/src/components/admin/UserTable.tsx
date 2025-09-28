import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { BackendUser } from "../../types/PostType";
import { getUser } from "../../api/UserApi";
export default function UserTable() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const fetchUser = async () => {
    try {
      const data = await getUser();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ width: 1200, margin: "auto" }}>
      <Table aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              유저 아이디
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              이메일
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              닉네임
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {user.userId}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {user.email}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {user.userNickname}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
