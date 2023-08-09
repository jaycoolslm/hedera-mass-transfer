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
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnFilesToImminentDir = exports.moveFilesToCompletedDir = exports.moveFilesToPendingDir = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const transferNft_1 = __importDefault(require("./lib/transferNft"));
const imminentDir = path_1.default.join(__dirname, "/json/a");
const pendingDir = path_1.default.join(__dirname, "/json/b");
const completedDir = path_1.default.join(__dirname, "/json/c");
const failedDir = path_1.default.join(__dirname, "/json/d");
// Pending transactions
let pendingTx = [];
// Move files from "imminent" directory to "pending" directory
function moveFilesToPendingDir() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs_extra_1.default.readdir(imminentDir);
            for (const file of files) {
                const filePath = `${imminentDir}/${file}`;
                const pendingFilePath = `${pendingDir}/${file}`;
                const fileContent = JSON.parse(yield fs_extra_1.default.readFile(filePath, "utf-8"));
                const { address, serial } = fileContent;
                pendingTx.push((0, transferNft_1.default)(address, serial, file));
                yield fs_extra_1.default.move(filePath, pendingFilePath);
            }
            console.log("Files moved to pending directory.");
        }
        catch (err) {
            console.error("Error moving files to pending directory:", err);
        }
    });
}
exports.moveFilesToPendingDir = moveFilesToPendingDir;
// Read files from "pending" directory and move them to "completed" directory
function moveFilesToCompletedDir() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // executing transfer functions
            const txArr = yield Promise.all(pendingTx).catch((error) => {
                console.log("One or more async functions rejected!");
                console.error("Error:", error);
            });
            console.log("All async functions completed executed");
            console.log("Results:", txArr); // [result1, result2, result3]
            for (let tx of txArr) {
                if (tx.status === 22) {
                    const successfulPath = `${pendingDir}/${tx.file}`;
                    const completedFilePath = `${completedDir}/${tx.file}`;
                    yield fs_extra_1.default.move(successfulPath, completedFilePath);
                }
                else {
                    const failedPath = `${pendingDir}/${tx.file}`;
                    const failedFilePath = `${failedDir}/${tx.file}`;
                    yield fs_extra_1.default.move(failedPath, failedFilePath);
                }
            }
            console.log("Files moved to completed directory.");
        }
        catch (err) {
            console.error("Error moving files to completed directory:", err);
        }
        finally {
            pendingTx = [];
        }
    });
}
exports.moveFilesToCompletedDir = moveFilesToCompletedDir;
function returnFilesToImminentDir() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs_extra_1.default.readdir(completedDir);
            for (const file of files) {
                const filePath = `${completedDir}/${file}`;
                const imminentFilePath = `${imminentDir}/${file}`;
                // get file data
                const fileContent = yield fs_extra_1.default.readFile(filePath, "utf-8");
                console.log(`File content of ${file}:`, fileContent);
                yield fs_extra_1.default.move(filePath, imminentFilePath);
            }
            console.log("Files moved to pending directory.");
        }
        catch (err) {
            console.error("Error moving files to pending directory:", err);
        }
    });
}
exports.returnFilesToImminentDir = returnFilesToImminentDir;
// // Run the functions in sequence
// (async function main() {
//   await moveFilesToPendingDir();
//   await moveFilesToCompletedDir();
// })();
