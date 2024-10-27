const { spawn } = require("node:child_process");
const fs = require("fs/promises");
class resizeImage {
  constructor() {}

  resizeOnlyQuality(quality, path, originalImage, format) {
    console.log("Only quality was provided");

    return new Promise(async (resolve, reject) => {
      // Create a writable stream for the error log
      const filehandle = await fs.open("./error.log", "w");

      const errorLogStream = filehandle.createWriteStream();

      const spawnProcess = spawn("convert", [
        originalImage,
        "-quality",
        quality,
        path,
      ]);

      // Capture standard output
      spawnProcess.stdout.on("data", (data) => {
        console.log(data.toString("utf-8"));
      });

      // Capture standard error and write to error log
      spawnProcess.stderr.on("data", (data) => {
        console.log(data.toString("utf8"));
      });

      // Handle process close
      spawnProcess.on("close", (code) => {
        errorLogStream.end(); // Close the error log stream
        if (code === 0) {
          resolve("success");
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      // Handle process error
      spawnProcess.on("error", (err) => {
        errorLogStream.end(); // Close the error log stream
        reject(err);
      });
    });
  }
  resizeWidthAndQuality(width, quality, path, originalImage) {
    // width are provided with quality to maintain aspect ratio.
    console.log("Only width was provided");
    return new Promise((resolve, reject) => {
      try {
        const spawnProcess = spawn("convert", [
          originalImage,
          "-resize",
          `${width}x`,
          "-quality",
          quality,
          path,
        ]);
        spawnProcess.on("close", (code) => {
          if (code === 0) {
            resolve("success");
          } else {
            reject(code);
          }
        });
        spawnProcess.on("exit", (code) => {
          if (code === 0) {
            resolve("success");
          } else {
            reject(code);
          }
        });
        spawnProcess.on("error", (err) => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  resizeHeightAndQuality(height, quality, path, originalImage) {
    console.log("Only height was provided");

    // Height are provided with quality to maintain aspect ratio.

    return new Promise((resolve, reject) => {
      try {
        const spawnProcess = spawn("convert", [
          originalImage,
          "-resize",
          `x${height}`,
          "-quality",
          quality,
          path,
        ]);
        spawnProcess.on("close", (code) => {
          if (code === 0) {
            resolve("success");
          } else {
            reject(code);
          }
        });
        spawnProcess.on("exit", (code) => {
          if (code === 0) {
            resolve("success");
          } else {
            reject(code);
          }
        });
        spawnProcess.on("error", (err) => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  resizeWidthAndHeightAndQuality(width, height, quality, path, originalImage) {
    // User does not care about aspect ratio ..
    console.log("Everything provided");

    return new Promise((resolve, reject) => {
      try {
        const spawnProcess = spawn("convert", [
          originalImage,
          "-resize",
          `${width}x${height}!`,
          "-quality",
          quality,
          path,
        ]);
        spawnProcess.on("close", (code) => {
          if (code === 0) {
            resolve("success");
          } else {
            reject(code);
          }
        });
        spawnProcess.on("exit", (code) => {
          if (code === 0) {
            resolve("success");
          } else {
            reject(code);
          }
        });
        spawnProcess.on("error", (err) => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

const resizeImg = new resizeImage();
module.exports = resizeImg;
