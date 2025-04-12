const API_OPTIONS = [
    "http://192.168.165.250:3003",
    "http://192.168.192.250:3003",
    "http://localhost:3003",
    "https://kptpo-backend.onrender.com"
];

const HEALTH_CHECK_PATH = "/auth/health";

const fetchWithTimeout = (url, options = {}, timeout = 1000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(url, {
        ...options,
        signal: controller.signal
    }).finally(() => clearTimeout(id));
};

export const getAvailableBaseUrl = async () => {
    // Try stored base URL first
    const storedURL = localStorage.getItem("BASE_URL");
    if (storedURL) {
        try {
            const res = await fetchWithTimeout(`${storedURL}${HEALTH_CHECK_PATH}`);
            if (res.ok) return storedURL;
        } catch (err) {
            console.warn("Stored BASE_URL not reachable:", storedURL);
        }
    }

    // Try all API options
    for (const url of API_OPTIONS) {
        try {
            const res = await fetchWithTimeout(`${url}${HEALTH_CHECK_PATH}`);
            if (res.ok) {
                localStorage.setItem("BASE_URL", url);
                console.log(`✅ Using API: ${url}`);
                return url;
            }
        } catch (err) {
            // console.warn(`❌ API not reachable: ${url}`);
        }
    }

    console.error("⚠️ No API is reachable!");
    return null;
};
