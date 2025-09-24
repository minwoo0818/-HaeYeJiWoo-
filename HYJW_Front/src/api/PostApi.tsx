import axios from "axios"
import type{Post} from "../types/PostType"

const BASE_URL = import.meta.env.VITE_API_URL;

export const GetPosts = async(type: string | undefined) : Promise<Post[]> => {
    const response = await axios.get(`${BASE_URL}/posts/${type}`);
    return response.data;
}