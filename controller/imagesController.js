const db = require("../DB");
const resizeImg = require("../lib/resizeClass");
const { randomBytes } = require("node:crypto");
const fs = require("node:fs/promises");
const {
  getImageDetails,
  convertHeicToJpg,
  getImageSize,
} = require("../lib/utils");
const { pipeline } = require("node:stream/promises");

const uploadImage = async (req, res) => {
  const imageId = randomBytes(4).toString("hex");
  await fs.mkdir(`./storage/${imageId}`, {
    recursive: true,
  });
  const oldPath = req.file.path;
  const newPath = `./storage/${imageId}/original`;
  await fs.rename(oldPath, newPath);
  try {
    const imagePath = `./storage/${imageId}/original`;
    // // Save video details.
    let data = await getImageDetails(imagePath);
    let imageJson = JSON.parse(data);
    console.log(` This is uploaded now ${imageJson}`);
    const { format, width, height, filesize, resolution, filename, units } =
      imageJson;

    // If format is HEIC then change it to jpg
    let newFormat = format;

    if (imageJson.format.toLowerCase() === "heic") {
      console.time("time");
      await convertHeicToJpg(imagePath, `./storage/${imageId}/heic.jpeg`);
      newFormat = "jpeg";
      await fs.rename(
        `./storage/${imageId}/heic.jpeg`,
        `./storage/${imageId}/original`
      );
      console.timeEnd("time");
    }
    const result = {
      id: db.images.length,
      imageId,
      name: filename,
      format: newFormat,
      width: +width,
      height: +height,
      filesize,
      resolution,
      units,
    };
    if (data) {
      db.update();
      db.images.unshift(result);
      db.save();
    }
    // At this point file should be saved in the unique imageId directory
    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    // Delete the directory with incomplete uploaded video.
    // deleteDirectory(`./storage/${imageId}`);
    console.log(error);
    return res.json({
      message: "Something bad happened!",
    });
  }
};
const reduceSize = async (req, res) => {
  let formData = req.body.formData;
  formData = JSON.parse(formData);
  if (formData.width <= 0 || formData.height <= 0) {
    res.status(404).json({
      status: "failed",
      message: "Width and Height should greator than 0.",
    });
  }

  try {
    db.update();
    const image = db.images.find((img) => img.imageId === formData.imageId);
    if (!image) throw new Error("An error occurred try again.");
    // enqueue the image in the queue
    const originalImage = `./storage/${image.imageId}/original`;
    const newImagePath = `./storage/${image.imageId}/compressed`;
    let data = undefined;
    // check if user just want to reduce quality while reserving original width and height
    if (formData.width === image.width && formData.height === image.height) {
      // User only want to change quality.
      data = await resizeImg.resizeOnlyQuality(
        formData.quality,
        newImagePath,
        originalImage,
        image.format
      );
    } else if (
      formData.width !== image.width &&
      formData.height === image.height
    ) {
      // User only want to change width and quality
      data = await resizeImg.resizeWidthAndQuality(
        formData.width,
        formData.quality,
        newImagePath,
        originalImage,
        image.format
      );
    } else if (
      formData.width === image.width &&
      formData.height !== image.height
    ) {
      // User only want to change height and quality of the img.

      data = await resizeImg.resizeHeightAndQuality(
        formData.height,
        formData.quality,
        newImagePath,
        originalImage,
        image.format
      );
    } else if (
      formData.width !== image.width &&
      formData.height !== image.height
    ) {
      // User want to change both height and widht of the image .
      data = await resizeImg.resizeWidthAndHeightAndQuality(
        formData.width,
        formData.height,
        formData.quality,
        newImagePath,
        originalImage,
        image.format
      );
    }
    // let compresssedFilePath;
    // if (image.format.toLowerCase() === "heic") {
    //   compresssedFilePath = `./storage/${image.imageId}/compressed.jpg`;
    // } else {
    //   compresssedFilePath = `./storage/${image.imageId}/compressed`;
    // }
    let size = await getImageSize(newImagePath);
    size = JSON.parse(size);
    res.status(201).json({
      status: "success",
      message: "Image has been compressed!",
      size: size.size,
    });
  } catch (error) {
    console.log(error);
    async;
    return res.json({ status: "failed", message: "Something bad happened !" });
  }
};

const downloadImage = async (req, res) => {
  const id = req.query.id;
  db.update();
  const compressedImage = db.images.find((img) => img.imageId === id);
  if (!compressedImage) {
    return res
      .status(404)
      .json({ status: "failed", message: "Image is not available." });
  }
  try {
    const imagePath = `./storage/${compressedImage.imageId}/compressed`;
    const imageHandle = await fs.open(imagePath, "r");

    const stats = await fs.stat(imagePath);
    const mimetype = `image/${compressedImage.format.toLowerCase()}`;
    res.set({
      "Content-Type": mimetype,
      "Content-Length": stats.size,
      "Content-Disposition": `attachment; filename="compressed.${compressedImage.format.toLowerCase()}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    const imageStream = imageHandle.createReadStream();
    await pipeline(imageStream, res);
    imageHandle.close();
    setTimeout(() => {
      const delt = async () => {
        await fs.rm(`./storage/${id}`, { recursive: true, force: true });
        console.log(`${id} has been deleted`);
      };
      delt();
    }, 5000);
    return res.status(200);
  } catch (error) {
    if (error instanceof Error) {
      return res.json({ status: "failed", message: error.message });
    }
    return res.json({ status: "failed", message: "Something bad happened!" });
  }
};

module.exports = {
  reduceSize,
  downloadImage,
  uploadImage,
};
