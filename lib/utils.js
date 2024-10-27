const { rejects } = require("node:assert");
const { spawn } = require("node:child_process");
const { sourceMapsEnabled } = require("node:process");

const getImageDetails = (imagePath) => {
  return new Promise((resolve, reject) => {
    try {
      const worker = spawn("identify", [
        "-format",
        `{
            "filename": "%f",
            "format": "%m",
            "width": %w,
            "height": %h,
            "depth": %z,
            "size": "%b",
            "colorspace": "%r",
            "compression": "%C",
            "resolution": [%x, %y],
            "filesize": "%[size]",
            "units": "%[units]"
          }`,
        imagePath,
      ]);
      let imageData = "";
      worker.on("close", (code) => {
        console.log(`code: `, code);
        if (code === 1) {
        }
      });
      worker.stdout.on("data", (data) => {
        imageData += data.toString("utf8");
      });
      worker.on("exit", (code) => {
        console.log(imageData);
        resolve(imageData);
      });
    } catch (error) {
      console.log("error", error);
      reject(JSON.stringify(error));
    }
  });
};

const getImageSize = async (path) => {
  // identify -format "{File size: %b\n}" image.jpg
  return new Promise((resolve, reject) => {
    try {
      const spawnProcess = spawn("identify", [
        "-format",
        `{"size": "%b"}`,
        path,
      ]);
      let size = "";
      spawnProcess.stdout.on("data", (chunk) => {
        size += chunk.toString("utf8");
      });
      spawnProcess.on("exit", (code) => {
        if (code === 0) {
          console.log(`exit ${size}`);
          resolve(size);
        } else {
          reject("Something bad happend.");
        }
      });
      spawnProcess.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const convertHeicToJpg = async (path, newPath) => {
  return new Promise((resolve, reject) => {
    try {
      const worker = spawn("convert", [path, newPath]);
      // Capture standard error and write to error log
      worker.stderr.on("data", (data) => {
        console.log(data.toString("utf8"));
      });
      worker.on("err", (err) => {
        throw new Error(`An error occurred ${err}`);
      });
      worker.on("close", (code) => {
        if (code === 0) {
          resolve("success");
        } else {
          throw new Error(`Error in HEIC to jpeg conversion ${code}`);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getImageDetails,
  getImageSize,
  convertHeicToJpg,
};
