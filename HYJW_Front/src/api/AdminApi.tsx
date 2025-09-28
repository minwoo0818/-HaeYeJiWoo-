interface AdminSettingsPayload {
  file_max_num: number;
  file_size: number;
  file_type: string;
}

export const getAdminSettings = async (token: string): Promise<AdminSettingsPayload> => {
  const res = await fetch("/api/admin/main", {
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

export const updateAdminSettings = async (
  token: string,
  payload: AdminSettingsPayload
): Promise<Response> => {
  const res = await fetch("/api/admin/main", {
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