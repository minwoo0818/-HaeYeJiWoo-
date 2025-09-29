import axios from "axios";
import type { AdminComment } from "../type";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getCommentsForAdmin = async (): Promise<AdminComment[]> => {
  const token = sessionStorage.getItem("jwt");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  const response = await axios.get(`${BASE_URL}/comments/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
