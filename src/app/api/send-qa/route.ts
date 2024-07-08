export async function GET(request: Request) {
  const { question, answer } = await request.json();
  console.log(question, answer);
  return new Response("Hello from Cloudflare Workers!");
}
