import axios from "axios";
import type { BackendUser } from "../types/PostType";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getUser = async (): Promise<BackendUser[]> => {
  const response = await axios.get(`${BASE_URL}/users/getuserinfo`);
  return response.data;
};
