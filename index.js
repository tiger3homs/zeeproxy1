export default {
  async fetch(req) {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("url");

    if (!target) return new Response("Missing url", { status: 400 });

    try {
      const upstream = await fetch(target, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "*/*",
          "Referer": target,
        },
      });

      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
          "Content-Type": upstream.headers.get("Content-Type") || "application/octet-stream",
        },
      });
    } catch (err) {
      return new Response("Failed to fetch stream", { status: 500 });
    }
  }
};
