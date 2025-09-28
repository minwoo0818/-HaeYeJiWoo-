export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  nickname: string;
  token?: string;
}

export const loginRequest = async (
  payload: LoginPayload,
  baseUrl: string
): Promise<LoginResponse> => {
  const res = await fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "로그인 실패");
  }

  const contentType = res.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    throw new Error("서버 응답이 JSON 형식이 아닙니다.");
  }

  const data = await res.json();
  const token = data.token || res.headers.get("Authorization");

  if (!token || !data.nickname) {
    throw new Error("토큰 또는 닉네임이 누락되었습니다.");
  }

  return { nickname: data.nickname, token };
};