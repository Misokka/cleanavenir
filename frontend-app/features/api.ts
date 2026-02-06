const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function post(endpoint: string, data: any) {
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function get(endpoint: string) {
  const response = await fetch(`${apiUrl}${endpoint}`);
  return response;
}

export async function put(endpoint: string, data: any) {
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function remove(endpoint: string) {
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "DELETE",
  });

  return response;
}