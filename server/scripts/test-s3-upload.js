/* eslint-disable no-console */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const must = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
};

const accessKeyId = must("AWS_ACCESS_KEY_ID");
const secretAccessKey = must("AWS_SECRET_ACCESS_KEY");
const region = must("AWS_REGION");
const bucket = must("S3_BUCKET_NAME");

console.log("env diagnostics:");
console.log("  access key id:           ", accessKeyId);
console.log("  access key id length:    ", accessKeyId.length, "(expect 20)");
console.log("  secret access key length:", secretAccessKey.length, "(expect 40)");
console.log("  secret first/last chars: ", JSON.stringify(secretAccessKey[0]), "...", JSON.stringify(secretAccessKey.slice(-1)));
console.log("  region:                  ", region);
console.log("  bucket:                  ", bucket);
console.log("");

const client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const key = `diagnostics/test-${Date.now()}.txt`;
const body = Buffer.from("hello from test-s3-upload.js");

console.log(`uploading test object: s3://${bucket}/${key}`);

client
  .send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "text/plain",
    })
  )
  .then(() => {
    console.log("✅ upload succeeded — credentials and bucket policy are good.");
  })
  .catch((err) => {
    console.error("❌ upload failed:", err.name, err.message);
    if (err.Code) console.error("   code:", err.Code);
    if (err.$metadata) console.error("   http:", err.$metadata.httpStatusCode);
    process.exit(1);
  });
