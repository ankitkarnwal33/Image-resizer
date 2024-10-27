// class imageQeueue {
//   #jobs = [];
//   #currentJob = null;
//   constructor() {}
//   enqueue(formData) {
//     this.#jobs.push(job);
//     this.dequeue();
//   }
//   dequeue() {
//     if (this.#currentJob) {
//       return;
//     }
//     this.#currentJob = this.#jobs.unshift();
//     this.main(this.#currentJob);
//   }
//   async main(job) {
//     try {
//       db.update();
//       const image = db.images.find((img) => img.imageId === formData.imageId);
//       if (!image) throw new Error("An error occurred try again.");
//       // enqueue the image in the queue
//       const originalImage = `./storage/${image.imageId}/original`;
//       const newImagePath = `./storage/${image.imageId}/compressed`;
//       let data = undefined;
//       // check if user just want to reduce quality while reserving original width and height
//       if (formData.width === image.width && formData.height === image.height) {
//         // User only want to change quality.
//         data = await resizeImg.resizeOnlyQuality(
//           formData.quality,
//           newImagePath,
//           originalImage,
//           image.format
//         );
//       } else if (
//         formData.width !== image.width &&
//         formData.height === image.height
//       ) {
//         // User only want to change width and quality
//         data = await resizeImg.resizeWidthAndQuality(
//           formData.width,
//           formData.quality,
//           newImagePath,
//           originalImage,
//           image.format
//         );
//       } else if (
//         formData.width === image.width &&
//         formData.height !== image.height
//       ) {
//         // User only want to change height and quality of the img.

//         data = await resizeImg.resizeHeightAndQuality(
//           formData.height,
//           formData.quality,
//           newImagePath,
//           originalImage,
//           image.format
//         );
//       } else if (
//         formData.width !== image.width &&
//         formData.height !== image.height
//       ) {
//         // User want to change both height and widht of the image .
//         data = await resizeImg.resizeWidthAndHeightAndQuality(
//           formData.width,
//           formData.height,
//           formData.quality,
//           newImagePath,
//           originalImage,
//           image.format
//         );
//       }
//       let compresssedFilePath;
//       if (image.format.toLowerCase() === "heic") {
//         compresssedFilePath = `./storage/${image.imageId}/compressed.jpg`;
//       } else {
//         compresssedFilePath = `./storage/${image.imageId}/compressed`;
//       }
//       let size = await getImageSize(compresssedFilePath);
//       size = JSON.parse(size);
//       res.status(201).json({
//         status: "success",
//         message: "Image has been compressed!",
//         size: size.size,
//       });
//     } catch (error) {
//       console.log(error);
//       return res.json({
//         status: "failed",
//         message: "Something bad happened !",
//       });
//     }
//   }
// }

// module.exports = imageQeueue;
