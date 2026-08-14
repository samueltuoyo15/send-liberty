import axios from "axios";
import https from "https";

// Create a custom axios instance that explicitly forces IPv4.
// This is necessary because Node.js 18+ (and specifically Zeabur's environment)
// attempts to route traffic over IPv6 by default for certain Google/GitHub API domains,
// which causes ETIMEDOUT errors because the Zeabur network drops IPv6 packets.
export const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ family: 4 }),
});

export default axiosInstance;
