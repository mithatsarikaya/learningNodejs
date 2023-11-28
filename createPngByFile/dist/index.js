"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
//__dirname: where this file is at.
const pagesDir = path_1.default.resolve(__dirname, "../pages"); //returns path
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
const mdxFiles = findMdxFiles(pagesDir);
let firstOnesPath = mdxFiles[1];
const mdxContent = fs_1.default.readFileSync(firstOnesPath, "utf8");
let titleOfTheMdx = (_b = (_a = mdxContent
    .split("---", 2)
    .find((elem) => elem.includes("title"))) === null || _a === void 0 ? void 0 : _a.split("\n").find((elem) => elem.includes("title"))) === null || _b === void 0 ? void 0 : _b.split('"')[1];
if (!titleOfTheMdx)
    throw new Error(`there is no title at ${firstOnesPath}`);
console.log(titleOfTheMdx);
// let frontmatterContent =
