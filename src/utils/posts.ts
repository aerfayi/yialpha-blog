import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

// -------------------------
// 类型定义
// -------------------------

export type BlogPost = CollectionEntry<"blog">;

export type BlogPostWithMeta = BlogPost & {
  coverImage: string;
  readingTime: number;
};

// -------------------------
// 获取所有文章
// -------------------------

export async function getAllPosts(): Promise<BlogPostWithMeta[]> {
  const posts = await getCollection("blog");

  return posts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
    )
    .map((post) => ({
      ...post,
      coverImage: post.data.cover || "/covers/default-cover.jpg",
      readingTime: Math.max(
        1,
        Math.ceil((post.body ?? "").split(/\s+/).length / 200)
      ),
    }));
}

// -------------------------
// 上一篇 / 下一篇
// -------------------------

export function getPrevNextPosts(
  allPosts: BlogPostWithMeta[],
  currentPost: BlogPostWithMeta
): {
  prevPost: BlogPostWithMeta | null;
  nextPost: BlogPostWithMeta | null;
} {
  const currentIndex = allPosts.findIndex((p) => p.id === currentPost.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  return { prevPost, nextPost };
}

// -------------------------
// 相关文章
// -------------------------

export function getRelatedPosts(
  currentPost: BlogPostWithMeta,
  allPosts: BlogPostWithMeta[],
  limit = 3
): BlogPostWithMeta[] {
  const related = allPosts
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        post.data.tags.some((tag) => currentPost.data.tags.includes(tag))
    )
    .slice(0, limit);

  return related;
}