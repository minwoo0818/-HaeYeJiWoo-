import axios from "axios";
import type { Post } from "./PostType";
import type { Comment } from "./type";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPostDetail = async (id: number): Promise<Post> => {
    const response = await axios.get(`${BASE_URL}/posts/?id=${id}`);
    console.log(response);
    return response.data;
}

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
    const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
    return response.data;
};



                                                                                                                                                                                                                        
 interface AddCommentPayload {                                                                                                                                                                                         
    content: string;                                                                                                                                                                                                    
    postId: number;                                                                                                                                                                                                     
    parentCommentId?: number;                                                                                                                                                                                           
 }                                                                                                                                                                                                                    
                                                                                                                                                                                                                        
         //  export const addComment = async (payload: AddCommentPayload): Promise<Comment> => {
         //  const response = await axios.post(`${BASE_URL}/comments`, payload, {
         //     headers: {
         //       // TODO: 실제 인증 토큰 또는 사용자 ID로 교체해야 합니다.
         //      'x-user-id': '1' // 임시 사용자 ID
         //      }
         //  });
         //    return response.data;
         // };    

         export const addComment = async (payload: AddCommentPayload): Promise<Comment> => {
          const response = await axios.post(`${BASE_URL}/comments`, payload);
          console.log(response);
          console.log(payload);
            return response.data;
         };    