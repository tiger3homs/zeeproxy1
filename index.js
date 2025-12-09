export default {
  async fetch(req) {
    try {
      const { searchParams } = new URL(req.url);

      // Get target URL from query parameter
      const target = searchParams.get("url");
      if (!target) return new Response("Missing 'url' parameter", { status: 400 });

      // Optional token protection
      const token = searchParams.get("token");
      const REQUIRED_TOKEN = "YOUR_SECRET_TOKEN"; // Replace with your secret token
      if (REQUIRED_TOKEN && token !== REQUIRED_TOKEN) {
        return new Response("Forbidden: Invalid token", { status: 403 });
      }

      // Fetch the target URL with headers to bypass common server blocks
      const upstream = await fetch(target, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "*/*",
          "Referer": target,
        },
      });

      // Forward response to client
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Cache-Control": "no-store",
          "Content-Type": upstream.headers.get("Content-Type") || "application/octet-stream",
        },
      });

    } catch (err) {
      // Catch all errors
      return new Response(`Failed to fetch stream: ${err.message}`, { status: 500 });
    }
  }
};
