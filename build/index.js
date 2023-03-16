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
exports.moveFilesToCompletedDir = exports.moveFilesToPendingDir = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const imminentDir = "./imminent";
const pendingDir = "./pending";
const completedDir = "./completed";
// Move files from "imminent" directory to "pending" directory
function moveFilesToPendingDir() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs_extra_1.default.readdir(imminentDir);
            for (const file of files) {
                const filePath = `${imminentDir}/${file}`;
                const pendingFilePath = `${pendingDir}/${file}`;
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
            const files = yield fs_extra_1.default.readdir(pendingDir);
            for (const file of files) {
                const pendingFilePath = `${pendingDir}/${file}`;
                const completedFilePath = `${completedDir}/${file}`;
                const fileContent = yield fs_extra_1.default.readFile(pendingFilePath, "utf-8");
                console.log(`File content of ${file}:`, fileContent);
                yield fs_extra_1.default.move(pendingFilePath, completedFilePath);
            }
            console.log("Files moved to completed directory.");
        }
        catch (err) {
            console.error("Error moving files to completed directory:", err);
        }
    });
}
exports.moveFilesToCompletedDir = moveFilesToCompletedDir;
// Run the functions in sequence
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield moveFilesToPendingDir();
        yield moveFilesToCompletedDir();
    });
})();
