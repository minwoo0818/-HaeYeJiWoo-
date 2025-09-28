export const checkDuplicate = async (
  field: "email" | "nickname",
  value: string,
  baseUrl: string
): Promise<string> => {
  const url = `${baseUrl}/users/check${field === "email" ? "Email" : "Nickname"}?value=${value}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.text();
};

export const signUp = async (
  email: string,
  password: string,
  nickname: string,
  baseUrl: string
): Promise<Response> => {
  const res = await fetch(`${baseUrl}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      hashedPassword: password,
      userNickname: nickname,
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res;
};
