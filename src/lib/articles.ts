import rawArticles from '../data/articles.json';

export type TocItem = {
  label: string;
  id: string;
  level: number;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  category: string;
  date: string;
  cover: string;
  featured: boolean;
  readingTime: number;
  wordCount: number;
  toc: TocItem[];
  html: string;
};

export const articles = rawArticles as Article[];

export const featuredArticles = articles.filter((article) => article.featured);

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function nextArticle(slug: string): Article {
  const index = articles.findIndex((article) => article.slug === slug);
  return articles[(index + 1) % articles.length];
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(`${date}T00:00:00+07:00`));
}

export function shortDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
    .format(new Date(`${date}T00:00:00+07:00`))
    .toUpperCase();
}

export function coverBase(article: Article): string {
  return article.cover.replace(/\.webp$/, '');
}

export function coverSrc(article: Article, width: 720 | 1440 = 1440): string {
  return `assets/images/journal/${coverBase(article)}-${width}.webp`;
}

export function coverSrcSet(article: Article): string {
  return [
    `assets/images/journal/${coverBase(article)}-720.webp 720w`,
    `assets/images/journal/${coverBase(article)}-1440.webp 1440w`,
  ].join(', ');
}
