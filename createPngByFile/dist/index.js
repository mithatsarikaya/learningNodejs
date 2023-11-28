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
const mdxFiles = findMdxFiles(pagesDir);
let firstOnesPath = mdxFiles[0];
const mdxContent = fs_1.default.readFileSync(firstOnesPath, "utf8");
let titleOfTheMdx = (_b = (_a = mdxContent
    .split("---", 2)
    .find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))) === null || _a === void 0 ? void 0 : _a.split("\n").find((elem) => elem.includes(propertyOfTheFrontmatterForOgImage))) === null || _b === void 0 ? void 0 : _b.split('"')[1];
if (!titleOfTheMdx)
    throw new Error(`there is no ${propertyOfTheFrontmatterForOgImage} at ${firstOnesPath}`);
console.log(titleOfTheMdx);
// let frontmatterContent =
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
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
    yield page.screenshot({
        path: path_1.default.resolve(__dirname, `../public/ogImages/${Math.random()}.png`),
        encoding: "binary",
    });
    yield browser.close();
}))();
