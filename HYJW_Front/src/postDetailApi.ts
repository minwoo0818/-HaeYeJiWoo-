import axios from "axios";
import type { BackendPostResponse, Post } from "./PostType";
import type { Comment } from "./type";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPostDetail = async (id: number): Promise<Post> => {
    const response = await axios.get<BackendPostResponse>(`${BASE_URL}/posts/detail/${id}`);
    // console.log(response);
    const backendPost = response.data;

    return {
        id: backendPost.postId,
        title: backendPost.title,
        nickname: backendPost.user.userNickname,
        image: backendPost.url,
        category: backendPost.categoryId,
        date: backendPost.createdAt,
        views: backendPost.views,
        hashtags: backendPost.hashtags,
        likes: backendPost.likesCount,
        content: backendPost.content,
        files: backendPost.files,
    };
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

export const deleteComment = async (commentId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/comments/${commentId}`);
};

export const updateComment = async (commentId: number, content: string): Promise<Comment> => {
    const response = await axios.put(`${BASE_URL}/comments/${commentId}`, { content });
    return response.data;
};

// 게시글 수정 (PUT 요청) 함수
export const updatePost = async (postId: number, updatedPost: Post): Promise<Post> => {
    try {
        const response = await axios.put<Post>(
            `${BASE_URL}/posts/${postId}`, // 백엔드 수정 API 경로
            updatedPost // 수정된 데이터
        );
        return response.data;
    } catch (error) {
        console.error('API Error updating post:', error);
        throw error;
    }
};