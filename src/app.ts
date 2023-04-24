import { moveFilesToPendingDir, moveFilesToCompletedDir } from ".";

const INTERVAL = 5000;

async function myFunction() {
  await moveFilesToPendingDir();
  await moveFilesToCompletedDir();
  // Call the function again after a specified delay (in milliseconds)
  setTimeout(myFunction, INTERVAL);
}

// Start the function
myFunction();
