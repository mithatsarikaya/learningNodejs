import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";

//__dirname: where this file is at.
const pagesDir = path.resolve(__dirname, "../pages"); //returns path

const findMdxFiles = (dir: string): string[] => {
  const files = fs.readdirSync(dir);
  const mdxFiles: string[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      mdxFiles.push(...findMdxFiles(filePath));
    } else if (file.endsWith(".mdx")) {
      mdxFiles.push(filePath);
    }
  }

  return mdxFiles;
};

let propertyOfTheFrontmatterForOgImage = "title";

const mdxFiles = findMdxFiles(pagesDir);
let firstOnesPath = mdxFiles[1];
const mdxContent = fs.readFileSync(firstOnesPath, "utf8");
let titleOfTheMdx = mdxContent
  .split("---", 2)
  .find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))
  ?.split("\n")
  .find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))
  ?.split('"')[1];

if (!titleOfTheMdx)
  throw new Error(
    `there is no ${propertyOfTheFrontmatterForOgImage} at ${firstOnesPath}`
  );

console.log(titleOfTheMdx);

// let frontmatterContent =
