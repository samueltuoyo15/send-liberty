// This module is server-side only (API routes, lib/ functions).
// It creates an axios instance with an IPv4-only HTTPS agent to prevent
// ETIMEDOUT errors on Zeabur, which drops IPv6 traffic silently.
// DO NOT import this on the client side — use plain axios instead.
import axios from "axios";

let axiosInstance: ReturnType<typeof axios.create>;

// Only configure httpsAgent in Node.js environment (server-side)
if (typeof window === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const https = require("https");
  axiosInstance = axios.create({
    httpsAgent: new https.Agent({ family: 4 }),
  });
} else {
  // Browser: plain axios, no Node.js agent
  axiosInstance = axios.create();
}

export { axiosInstance };
export default axiosInstance;
