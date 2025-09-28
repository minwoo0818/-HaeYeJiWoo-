export interface UserInfo {
  email: string;
  userNickname: string;
}

export interface UpdateUserPayload {
  email: string;
  nickname: string;
  password: string;
}

export const getUserInfo = async (token: string): Promise<UserInfo> => {
  const res = await fetch("/api/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};

export const updateUserInfo = async (
  token: string,
  payload: UpdateUserPayload
): Promise<Response> => {
  const res = await fetch("/api/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res;
};