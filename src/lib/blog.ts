import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

import { processFrontMatter, processMarkdownToHtml } from "./blog-process";
import { AllSettledManager, assertNever, ensureString } from "./utils";

/**
 * Directory in which posts are stored.
 */
const POSTS_PATH = path.join(cwd(), "posts");

/**
 * Common file shared by translated posts.
 */
const METADATA_FILE_NAME = "_post.json";

//
// Public interface.
//

export async function getPostBySlug(lang: string, slug: string): Promise<Post> {
  const postDirPath = resolvePostDirPathFromSlug(slug);

  const sharedMetadata = await loadSharedMetadata(slug, postDirPath);
  const metadata = resolveMetadata(sharedMetadata, lang);

  const postSource = await loadPostSource(metadata);
  const head = await processPostHead(postSource);
  const post = await processPostContent(head, postSource.sourceText);

  return post;
}

export async function getPosts(langFilter?: string): Promise<Post[]> {
  return getPostsWithMap(langFilter, (head, sourceText) =>
    processPostContent(head, sourceText)
  );
}

export async function getPostHeads(langFilter?: string): Promise<PostHead[]> {
  return getPostsWithMap(langFilter, (head) => Promise.resolve(head));
}

async function getPostsWithMap<T>(
  langFilter: string | undefined,
  map: (head: PostHead, sourceText: string, m: AllSettledManager) => Promise<T>
): Promise<T[]> {
  const dirs = await fs.readdir(POSTS_PATH);

  const m = new AllSettledManager();

  const sharedMetaList = m.unwrapOk(
    await Promise.allSettled(
      dirs.map((dir) => {
        const path = resolvePostDirPathFromSlug(dir);
        return loadSharedMetadata(dir, path);
      })
    )
  );

  const metaList = sharedMetaList
    .flatMap(resolveAllMetadata)
    .filter((meta) => !langFilter || meta.lang === langFilter);

  const postSourceList = m.unwrapOk(
    await Promise.allSettled(metaList.map(loadPostSource))
  );

  const mapped = m.unwrapOk(
    await Promise.allSettled(
      postSourceList.map(async (postSource) => {
        let head = await processPostHead(postSource);
        return map(head, postSource.sourceText, m);
      })
    )
  );

  return mapped;
}

//
// Main types that arise while processing posts.
//

export type PostProcessor = "md";

export type Post = {
  head: PostHead;
  html: string;
};

export type PostHead = {
  title: string;
  meta: PostMetadata;
};

export type PostSource = {
  frontMatter: Record<string, unknown>;
  sourceText: string;
  meta: PostMetadata;
};

export type PostMetadata = {
  slug: string;
  date: string;
  lang: string;
  relativeSourcePath: string;
  sourcePath: string;
  processor: PostProcessor;
};

type SharedMetadata = {
  slug: string;
  // Sadly one can not use `Date` here since Next.js only accept values that
  // can be serialized as JSON.
  date: string;
  langs: Record<string, string>;
  relativePostDirPath: string;
  postDirPath: string;
};

type RawSharedMetadata = {
  slug: string;
  date: string;
  // Maps a language id to the post path, relative to the metadata file path.
  langs: Record<string, string>;
};

//
// Below are processing functions.
//

async function processPostContent(
  head: PostHead,
  sourceText: string
): Promise<Post> {
  let html = "";
  switch (head.meta.processor) {
    case "md":
      html = await processMarkdownToHtml(sourceText);
      break;
    default:
      assertNever(head.meta.processor);
  }

  return { html, head };
}

async function processPostHead(source: PostSource): Promise<PostHead> {
  const title = ensureString(
    source.frontMatter.title,
    `Post '${source.meta.slug}' missing 'title' front-matter property, at '${source.meta.sourcePath}'.`
  );

  return { title, meta: source.meta };
}

async function loadPostSource(meta: PostMetadata): Promise<PostSource> {
  const raw = await fs.readFile(meta.sourcePath, "utf-8");
  const { frontMatter, sourceText } = processFrontMatter(raw);

  return { frontMatter, sourceText, meta };
}

function resolveAllMetadata(meta: SharedMetadata): PostMetadata[] {
  return Object.keys(meta.langs).map((lang) => resolveMetadata(meta, lang));
}

function resolveMetadata(meta: SharedMetadata, lang: string): PostMetadata {
  let rawPath = meta.langs[lang];

  if (!rawPath) {
    throw new Error(`No post with lang '${lang}' at '${meta.postDirPath}'.`);
  }

  const rawSourcePath = path.join(meta.postDirPath, rawPath);
  const sourcePath = path.normalize(rawSourcePath);

  const { base, ext } = path.parse(sourcePath);
  const relativeSourcePath = `${meta.relativePostDirPath}/${base}`;

  return {
    slug: meta.slug,
    date: meta.date,
    lang,
    relativeSourcePath,
    sourcePath,
    processor: decidePostProcessor(ext),
  };
}

async function loadSharedMetadata(
  postDirName: string,
  postDirPath: string
): Promise<SharedMetadata> {
  const metaPath = path.join(postDirPath, METADATA_FILE_NAME);
  const text = await fs.readFile(metaPath, "utf-8");

  // TODO: Validate this deserialization.
  const json: RawSharedMetadata = JSON.parse(text);

  if (json.slug !== postDirName) {
    throw new Error(
      `Post slug should be equal to its directory name, at '${postDirPath}'.`
    );
  }

  return {
    slug: json.slug,
    date: json.date,
    langs: json.langs,
    relativePostDirPath: postDirName,
    postDirPath,
  };
}

function decidePostProcessor(postSourceFileExt: string): PostProcessor {
  switch (postSourceFileExt) {
    case ".md":
      return "md";
    default:
      throw new Error(
        `Post source of extension '${postSourceFileExt}' is not supported.`
      );
  }
}

//
// Other utilities related to this module.
//

function resolvePostDirPathFromSlug(slug: string) {
  return path.join(POSTS_PATH, slug);
}
