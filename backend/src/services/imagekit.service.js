const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload file buffer to ImageKit
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @returns {Promise<string>} - Public URL of uploaded file
 */
async function uploadResumeToImageKit(fileBuffer, fileName) {
  try {
    const response = await imagekit.upload({
      file: fileBuffer,           // ✅ buffer directly
      fileName: fileName,
      folder: "/resumes",         // ✅ organized in /resumes folder
      useUniqueFileName: true,    // ✅ avoid name conflicts
    });

    console.log("✅ Resume uploaded to ImageKit:", response.url);
    return {
      url: response.url,
      fileId: response.fileId,    // save this if you want to delete later
    };
  } catch (err) {
    console.error("❌ ImageKit upload error:", err.message);
    throw new Error("Failed to upload resume to ImageKit");
  }
}

module.exports = { uploadResumeToImageKit };