"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
//__dirname: where this file is at.
const pagesDir = path_1.default.resolve(__dirname, "../pages");
const findMdxFiles = (dir) => {
    const files = fs_1.default.readdirSync(dir);
    const mdxFiles = [];
    for (const file of files) {
        const filePath = path_1.default.join(dir, file);
        const stats = fs_1.default.statSync(filePath);
        if (stats.isDirectory()) {
            mdxFiles.push(...findMdxFiles(filePath));
        }
        else if (file.endsWith(".mdx")) {
            mdxFiles.push(filePath);
        }
    }
    return mdxFiles;
};
let propertyOfTheFrontmatterForOgImage = "title";
const mdxFilesPaths = findMdxFiles(pagesDir);
for (const mdxFilePath of mdxFilesPaths) {
    let fileNameOfThePng = mdxFilePath.split("/").at(-2);
    const mdxContent = fs_1.default.readFileSync(mdxFilePath, "utf8");
    let titleOfTheMdx = (_b = (_a = mdxContent
        .split("---", 2)
        .find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))) === null || _a === void 0 ? void 0 : _a.split("\n").find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))) === null || _b === void 0 ? void 0 : _b.split('"')[1];
    if (!titleOfTheMdx)
        throw new Error(`there is no ${propertyOfTheFrontmatterForOgImage} at ${mdxFilePath}`);
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        //read the template to put the title on the page
        const html = fs_1.default
            .readFileSync("/home/nuuklu/Desktop/LearningByDoing/learningNodejs/createPngByFile/src/template.html", "utf-8")
            .toString()
            .replace("@titleToShow", titleOfTheMdx);
        console.log(html);
        const page = yield browser.newPage();
        yield page.setContent(html);
        yield page.waitForNetworkIdle();
        yield page.setViewport({
            width: 1200,
            height: 630,
        });
        //ss the dynamically generated html page and save it.
        yield page.screenshot({
            path: path_1.default.resolve(__dirname, `../public/ogImages/${fileNameOfThePng}.png`),
            encoding: "binary",
        });
        yield browser.close();
    }))();
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
// TODO: get all the title from mdx by loop
// TODO: check if related png is already exist
// TODO: if not exist then create the png
