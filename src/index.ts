import fs from "fs-extra";
import transferNft from "./lib/transferNft";
const imminentDir = "src/json/a";
const pendingDir = "src/json/b";
const completedDir = "src/json/c";

// Pending transactions
let pendingTx: Promise<{ status: number; file: string }>[] = [];

// Move files from "imminent" directory to "pending" directory
export async function moveFilesToPendingDir() {
  try {
    const files = await fs.readdir(imminentDir);

    for (const file of files) {
      const filePath = `${imminentDir}/${file}`;
      const pendingFilePath = `${pendingDir}/${file}`;

      const fileContent = JSON.parse(await fs.readFile(filePath, "utf-8"));

      const { address, serial } = fileContent;
      pendingTx.push(transferNft(address, serial, file));
      await fs.move(filePath, pendingFilePath);
    }

    console.log("Files moved to pending directory.");
  } catch (err) {
    console.error("Error moving files to pending directory:", err);
  }
}

// Read files from "pending" directory and move them to "completed" directory
export async function moveFilesToCompletedDir() {
  try {
    // executing transfer functions
    const txArr = await Promise.all(pendingTx).catch((error) => {
      console.log("One or more async functions rejected!");
      console.error("Error:", error);
    });

    console.log("All async functions completed successfully!");
    console.log("Results:", txArr); // [result1, result2, result3]

    for (let tx of txArr!) {
      if (tx.status === 22) {
        const successfulPath = `${pendingDir}/${tx.file}`;
        const completedFilePath = `${completedDir}/${tx.file}`;
        await fs.move(successfulPath, completedFilePath);
      }
    }

    console.log("Files moved to completed directory.");
  } catch (err) {
    console.error("Error moving files to completed directory:", err);
  }
}

export async function returnFilesToImminentDir() {
  try {
    const files = await fs.readdir(completedDir);
    for (const file of files) {
      const filePath = `${completedDir}/${file}`;
      const imminentFilePath = `${imminentDir}/${file}`;
      // get file data
      const fileContent = await fs.readFile(filePath, "utf-8");
      console.log(`File content of ${file}:`, fileContent);
      await fs.move(filePath, imminentFilePath);
    }

    console.log("Files moved to pending directory.");
  } catch (err) {
    console.error("Error moving files to pending directory:", err);
  }
}

// // Run the functions in sequence
// (async function main() {
//   await moveFilesToPendingDir();
//   await moveFilesToCompletedDir();
// })();
