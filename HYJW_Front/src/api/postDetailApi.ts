import axios from "axios";
import type { Comment } from "../type";
import type { Post, BackendPostResponse } from "../types/PostType";

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
        createdAt: backendPost.createdAt,
        updatedAt: backendPost.updatedAt,
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



                                                                                                                                                                                                                        

//          //       // TODO: 실제 인증 토큰 또는 사용자 ID로 교체해야 합니다.
//          //      'x-user-id': '1' // 임시 사용자 ID
//          //      }
//          //  });
//          //    return response.data;
//          // };    


 //import { CommentType } from '../type';

// const API_BASE_URL = 'http://localhost:8080/api';

export const addComment = async (
  postId: number,
  content: string,
  parentCommentId: number | null = null
): Promise<Comment> => {
  try {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const payload: { postId: number; content: string; parentCommentId?: number } = {
      postId,
      content,
    };

    if (parentCommentId !== null) {
      payload.parentCommentId = parentCommentId;
    }

    const response = await axios.post(`${BASE_URL}/comments`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("댓글 추가 실패:", error);
    throw error;
  }
};


export const deleteComment = async (commentId: number): Promise<void> => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    await axios.delete(`${BASE_URL}/comments/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateComment = async (commentId: number, content: string): Promise<Comment> => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    const response = await axios.put(
        `${BASE_URL}/comments/${commentId}`,
        { content },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// export const updatePost = async (postId: number, data: { title: string, content: string }): Promise<Post> => {
//     const response = await axios.put(`${BASE_URL}/posts/${postId}`, data);
//     return response.data;
// };

// Post Like APIs
export const likePost = async (postId: number): Promise<void> => {
    let token = sessionStorage.getItem("jwt");
    console.log("Token from sessionStorage (raw):", token); // Added console.log
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    // Remove "Bearer " prefix if it exists
    if (token.startsWith("Bearer ")) {
        token = token.substring(7);
    }
    console.log("Token from sessionStorage (cleaned):", token); // Added console.log

    await axios.post(`${BASE_URL}/posts/${postId}/like`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const unlikePost = async (postId: number): Promise<void> => {
    let token = sessionStorage.getItem("jwt");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    // Remove "Bearer " prefix if it exists
    if (token.startsWith("Bearer ")) {
        token = token.substring(7);
    }
    await axios.delete(`${BASE_URL}/posts/${postId}/like`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getPostLikeStatus = async (postId: number): Promise<boolean> => {
    try {
        let token = sessionStorage.getItem("jwt");
        if (!token) {
            throw new Error("Authentication token not found.");
        }
        // Remove "Bearer " prefix if it exists
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        const response = await axios.get(`${BASE_URL}/posts/${postId}/like/status`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // return response.status === 200;
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false; // Not found means not liked
        }
        throw error;
    }
};

export const getPostLikesCount = async (postId: number): Promise<number> => {
    let token = sessionStorage.getItem("jwt");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    // Remove "Bearer " prefix if it exists
    if (token.startsWith("Bearer ")) {
        token = token.substring(7);
    }
    const response = await axios.get(`${BASE_URL}/posts/${postId}/likes/count`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.count; // Assuming backend returns { count: number }
}
// 게시글 수정 (PUT 요청) 함수
export const updatePost = async (postId: number, updatedPost: Post): Promise<Post> => {
  try {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    const formData = new FormData();

    // 문자열 데이터 추가
    formData.append("title", updatedPost.title);
    formData.append("content", updatedPost.content);

    // 해시태그 배열 → JSON 문자열로 변환해서 전송
    if (updatedPost.hashtags) {
      formData.append("hashtags", JSON.stringify(updatedPost.hashtags));
    }

    // 파일 데이터 처리
    if (updatedPost.files) {
      updatedPost.files.forEach((fileObj: any) => {
        // 새로 업로드한 파일이면 `file` 속성이 있을 것이고,
        // 기존 파일이면 url만 있을 수 있음
        if (fileObj.file) {
          formData.append("files", fileObj.file);
        } else {
          // 기존 파일은 그대로 유지할 수 있도록 id나 url을 따로 전송
          formData.append("existingFiles", JSON.stringify(fileObj));
        }
      });
    }

    const response = await axios.put<Post>(
      `${BASE_URL}/posts/${postId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (postId: number): Promise<void> => {
  const token = sessionStorage.getItem("jwt");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  await axios.delete(`${BASE_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const restorePost = async (postId: number): Promise<void> => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    await axios.put(`${BASE_URL}/posts/${postId}/restore`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getDeletedPosts = async (): Promise<Post[]> => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    const response = await axios.get(`${BASE_URL}/posts/admin/deleted`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const hardDeletePost = async (postId: number): Promise<void> => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    await axios.delete(`${BASE_URL}/posts/admin/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};