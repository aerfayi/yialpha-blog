import rss from "@astrojs/rss";
import { getAllPosts } from "../utils/posts";

export async function GET() {
  const posts = await getAllPosts();

  return rss({
    title: "YIAlpha",

    description:
      "AI × Game Tech × World Building",

    site: "https://yialpha.lilys.top",

    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}