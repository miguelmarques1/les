import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    timeout: 30 * 1000,
    testDir: path.join(__dirname, "e2e"),
    retries: 1,
    outputDir: "test-results/",
    workers: 1,
    webServer: {
        command: "npm run dev",
        url: baseURL,
        timeout: 60 * 1000,
        reuseExistingServer: !process.env.CI,
        env: {
            PORT: PORT.toString(),
        }
    },

    use: {
        baseURL,
        trace: "retry-with-trace",
    },

    projects: [
        {
            name: "Desktop Chrome",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "Mobile Chrome",
            use: { ...devices["Pixel 5"] },
        },
    ],
});