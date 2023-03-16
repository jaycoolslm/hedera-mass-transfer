import {
  moveFilesToPendingDir,
  moveFilesToCompletedDir,
  returnFilesToImminentDir,
} from "..";
import fs from "fs-extra";

describe("File movement", () => {
  test("files in imminent should move to pending", async () => {
    const imminentBefore = await fs.readdir("src/json/a");
    console.log("imminingent before", imminentBefore);
    await moveFilesToPendingDir();
    const imminentAfter = await fs.readdir("src/json/a");
    console.log("imminingent after", imminentAfter);

    // expect(imminentAfter.length).toBe(0);
    const pendingAfter = await fs.readdir("src/json/b");
    const subset = isSubset(imminentBefore, pendingAfter);
    expect(subset).toBe(true);
  });

  test("files in pending should move to completed", async () => {
    const pendingBefore = await fs.readdir("src/json/b");
    await moveFilesToCompletedDir();
    const pendingAfter = await fs.readdir("src/json/b");

    const completedAfter = await fs.readdir("src/json/c");
    const subset = isSubset(pendingBefore, completedAfter);
  });

  //   test("files should return to imminent", async () => {
  //     await returnFilesToImminentDir();
  //     const completedAfter = await fs.readdir("src/json/completed");
  //     expect(completedAfter.length).toBe(0);
  //   });
});

function isSubset(arr1: string[], arr2: string[]) {
  const m = arr1.length;
  const n = arr2.length;
  let i = 0;
  let j = 0;
  for (i = 0; i < n; i++) {
    for (j = 0; j < m; j++) if (arr2[i] == arr1[j]) break;
    if (j == m) return false;
  }
  return true;
}
