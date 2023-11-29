import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";

//__dirname: where this file is at.
const pagesDir = path.resolve(__dirname, "../pages");

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

const mdxFilesPaths = findMdxFiles(pagesDir);

for (const mdxFilePath of mdxFilesPaths) {
  let fileNameOfThePng = mdxFilePath.split("/").at(-2);
  const mdxContent = fs.readFileSync(mdxFilePath, "utf8");
  let titleOfTheMdx = mdxContent
    .split("---", 2)
    .find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))
    ?.split("\n")
    .find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))
    ?.split('"')[1];

  //throw error if ther eis no title
  if (!titleOfTheMdx)
    throw new Error(
      `there is no ${propertyOfTheFrontmatterForOgImage} at ${mdxFilePath}`
    );

  let filePathToSave = path.resolve(
    __dirname,
    `../public/ogImages/${fileNameOfThePng}.png`
  );
  // if (fs.existsSync(filePathToSave)) {
  //   continue;
  // }

  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    //read the template to put the title on the page
    const html = fs
      .readFileSync(
        "/home/nuuklu/Desktop/LearningByDoing/learningNodejs/createPngByFile/src/template.html",
        "utf-8"
      )
      .toString()
      .replace("@titleToShow", titleOfTheMdx!);
    console.log(html);

    const page = await browser.newPage();
    await page.setContent(html);
    await page.waitForNetworkIdle();
    await page.setViewport({
      width: 1200,
      height: 630,
    });

    //ss the dynamically generated html page and save it.
    await page.screenshot({
      path: filePathToSave,
      encoding: "binary",
    });
    // await page.screenshot({
    //   path: path.resolve(
    //     __dirname,
    //     `../public/ogImages/${fileNameOfThePng}.png`
    //   ),
    //   encoding: "binary",
    // });
    await browser.close();
  })();
}

// let firstOnesPath = mdxFilesPaths[0];
//get last folder name of the post. e.g: ../../bizedemimenu/index.mdx = bizedemimenu
// let fileNameOfThePng = firstOnesPath.split("/").at(-2);
// const mdxContent = fs.readFileSync(firstOnesPath, "utf8");
// let titleOfTheMdx = mdxContent
//   .split("---", 2)
//   .find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))
//   ?.split("\n")
//   .find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))
//   ?.split('"')[1];

// if (!titleOfTheMdx)
//   throw new Error(
//     `there is no ${propertyOfTheFrontmatterForOgImage} at ${firstOnesPath}`
//   );

// let frontmatterContent =

// (async () => {
//   const browser = await puppeteer.launch({
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   //read the template to put the title on the page
//   const html = fs
//     .readFileSync(
//       "/home/nuuklu/Desktop/LearningByDoing/learningNodejs/createPngByFile/src/template.html",
//       "utf-8"
//     )
//     .toString()
//     .replace("@titleToShow", titleOfTheMdx!);
//   console.log(html);

//   const page = await browser.newPage();
//   await page.setContent(html);
//   await page.waitForNetworkIdle();
//   await page.setViewport({
//     width: 1200,
//     height: 630,
//   });

//   //ss the dynamically generated html page and save it.
//   await page.screenshot({
//     path: path.resolve(__dirname, `../public/ogImages/${fileNameOfThePng}.png`),
//     encoding: "binary",
//   });
//   await browser.close();
// })();

// TODOne: get all the title from mdx by loop
// TODO: check if related png is already exist
// TODO: if not exist then create the png
