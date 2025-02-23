import { cookies } from "next/headers";
export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  // const apiToken = "LA0fZuSBQvaf5NKjbH7kCaO8IsVlTTsoxbA6GugkBl2RnULkgoj5osaCzM2fyxZl"; // هنا حط التوكين الصحيح
  const apiToken = cookies().get("token")?.value;
  if (!path) {
    return new Response(JSON.stringify({ error: "Path is required" }), {
      status: 400,
    });
  }

  const apiUrl = `http://myres.me/thmdev/api/${path}&api_token=${apiToken}&${searchParams.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
