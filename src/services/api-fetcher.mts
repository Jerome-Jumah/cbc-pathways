import axios from "axios";
import https from "https";
import axiosRetry from "axios-retry";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// 🛡️ AGGRESSIVE RETRY STRATEGY
// This will intercept timeouts and 5xx errors and try again automatically.
axiosRetry(axios, {
  retries: 10, // Try 10 times before completely giving up on a specific request
  retryDelay: retryCount => {
    const delay = retryCount * 5000; // Waits 5s, 10s, 15s, 20s...
    console.log(`⚠️ KUCCPS API timeout. Retrying in ${delay / 1000}s... (Attempt ${retryCount}/10)`);
    return delay;
  },
  retryCondition: error => {
    // Retry on standard network errors or explicit ECONNABORTED (Timeouts)
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === "ECONNABORTED";
  },
});

// The headers you extracted from your browser
const KUCCPS_API_HEADERS = {
  Accept: "application/json",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7",
  Connection: "keep-alive",
  Cookie: "_ga=GA1.1.352528799.1776872966; _ga_NYRD35N9DN=GS2.1.s1776872966$o1$g0$t1776872981$j45$l0$h0",
  Host: "selection.education.go.ke",
  Referer: "https://selection.education.go.ke/pathways",
  "Sec-Ch-Ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
};

const BASE_URL = "https://selection.education.go.ke/api/api/v1";

export const fetchSubjectCombinations = async (track: string) => {
  const response = await axios.get(`${BASE_URL}/filter/subject-combinations`, {
    headers: KUCCPS_API_HEADERS,
    params: { track },
    httpsAgent,
    timeout: 60000, // ⏳ 60-second timeout to give the fragile API plenty of time
  });
  return response.data;
};

export const fetchSchoolsByCombination = async (subjectCombinationId: string, page = 1, limit = 50) => {
  const response = await axios.get(`${BASE_URL}/map/subject-combination/senior-secondary-schools`, {
    headers: KUCCPS_API_HEADERS,
    params: {
      "subject-combination-id": subjectCombinationId,
      page,
      limit,
    },
    httpsAgent,
    timeout: 60000, // ⏳ 60-second timeout
  });
  return response.data;
};
