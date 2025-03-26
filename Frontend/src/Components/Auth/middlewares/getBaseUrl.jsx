const API_OPTIONS = [
    "http://192.168.165.250:3003", // Local Network IP
    "http://192.168.192.250:3003",
    "http://localhost:3003"  // VPN IP
];

export const getAvailableBaseUrl = async () => {
    for (const url of API_OPTIONS) {
        try {
            const response = await fetch(`${url}/auth/health`, { method: "GET", timeout: 300 });
            if (response.ok) {
                console.log(`✅ Using API: ${url}`);
                return url;
            }
        } catch (error) {
            // console.warn(`❌ API not reachable: ${url}`);
        }
    }
    console.error("⚠️ No API is reachable!");
    return null; // Handle error gracefully
};
