export const verifyPassword = async (token: string, password: string) => {
  const res = await fetch("/api/user/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res;
};
