const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { DeleteObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const uploadsDirectory = path.join(__dirname, "../../uploads");

const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set. Add it to your backend environment.`);
  }

  return value;
};

const getBucketName = () => getRequiredEnv("S3_BUCKET_NAME");
const getRegion = () => getRequiredEnv("AWS_REGION");

const getPublicBaseUrl = () =>
  (
    process.env.S3_PUBLIC_BASE_URL ||
    `https://${getBucketName()}.s3.${getRegion()}.amazonaws.com`
  ).replace(/\/+$/, "");

const getS3Client = () =>
  new S3Client({
    region: getRegion(),
    credentials: {
      accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
      secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

const isAbsoluteUrl = (value = "") => /^https?:\/\//i.test(value);

const sanitizeBaseName = (value, fallback) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || fallback;

const createObjectKey = (folder, originalName, fallbackName) => {
  const extension = path.extname(originalName || "").toLowerCase();
  const baseName = sanitizeBaseName(path.basename(originalName || "", extension), fallbackName);

  return `${folder}/${Date.now()}-${crypto.randomInt(1_000_000_000)}-${baseName}${extension}`;
};

const uploadBufferToS3 = async (file, folder, fallbackName) => {
  if (!file || !file.buffer) {
    return "";
  }

  const bucket = getBucketName();
  const key = createObjectKey(folder, file.originalname, fallbackName);

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${getPublicBaseUrl()}/${key}`;
};

const removeLocalFileIfExists = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const getLocalUploadAbsolutePath = (imagePath) =>
  imagePath ? path.join(uploadsDirectory, imagePath.replace(/^\/uploads\//, "")) : "";

const removeStoredFile = async (storedPath) => {
  if (!storedPath) {
    return;
  }

  if (!isAbsoluteUrl(storedPath)) {
    if (storedPath.startsWith("/uploads/")) {
      await removeLocalFileIfExists(getLocalUploadAbsolutePath(storedPath));
    }

    return;
  }

  const publicBaseUrl = getPublicBaseUrl();

  if (!storedPath.startsWith(`${publicBaseUrl}/`)) {
    return;
  }

  const key = storedPath.slice(publicBaseUrl.length + 1);

  if (!key) {
    return;
  }

  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    })
  );
};

const getStoredFileUrl = (req, storedPath) => {
  if (!storedPath) {
    return "";
  }

  if (isAbsoluteUrl(storedPath)) {
    return storedPath;
  }

  return `${req.protocol}://${req.get("host")}${storedPath}`;
};

const getStoredFileName = (storedPath) => {
  if (!storedPath) {
    return "";
  }

  if (isAbsoluteUrl(storedPath)) {
    try {
      return path.basename(new URL(storedPath).pathname);
    } catch (_error) {
      return path.basename(storedPath);
    }
  }

  return path.basename(storedPath);
};

module.exports = {
  getStoredFileName,
  getStoredFileUrl,
  removeStoredFile,
  uploadBufferToS3,
};
