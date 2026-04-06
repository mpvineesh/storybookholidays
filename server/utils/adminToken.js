const crypto = require("crypto");

const TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 12;

const getTokenSecret = () => {
  const secret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD;

  if (!secret) {
    throw new Error("Admin token secret is not configured");
  }

  return secret;
};

const signPayload = (payload) =>
  crypto.createHmac("sha256", getTokenSecret()).update(payload).digest("base64url");

const createAdminToken = (username) => {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + TOKEN_LIFETIME_MS,
    })
  ).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
};

const verifyAdminToken = (token) => {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    throw new Error("Invalid admin token");
  }

  const expectedSignature = signPayload(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid admin token");
  }

  const parsedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

  if (!parsedPayload.exp || parsedPayload.exp < Date.now()) {
    throw new Error("Admin session expired");
  }

  return {
    username: parsedPayload.username,
  };
};

module.exports = {
  createAdminToken,
  verifyAdminToken,
};
