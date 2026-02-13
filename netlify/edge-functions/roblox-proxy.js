export default async (request) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  const response = await fetch(decodeURIComponent(targetUrl), {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const body = await response.text();
  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};