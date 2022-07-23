import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkPrism from "remark-prism";

export type FrontMattered = {
  frontMatter: Record<string, unknown>;
  sourceText: string;
};

export function processFrontMatter(raw: string): FrontMattered {
  const { data: frontMatter, content: sourceText } = matter(raw);
  return { frontMatter, sourceText };
}

export async function processMarkdownToHtml(src: string): Promise<string> {
  const content = await remark()
    .use(remarkHtml, { sanitize: false })
    .use(remarkPrism)
    .process(src);

  return content.toString();
}
