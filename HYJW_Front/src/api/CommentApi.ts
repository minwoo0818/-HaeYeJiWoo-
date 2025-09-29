import axios from "axios";
import type { AdminComment } from "../type";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getCommentsForAdmin = async (): Promise<AdminComment[]> => {
  const response = await axios.get(`${BASE_URL}/comments/admin`);
  return response.data;
};
