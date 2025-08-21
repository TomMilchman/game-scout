import { Cluster } from "puppeteer-cluster";

let cluster: Cluster | null = null;

export async function getCluster() {
    if (!cluster) {
        cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: 5,
            puppeteerOptions: { headless: true },
            timeout: 30000,
        });

        cluster?.on("taskerror", (err, data) => {
            console.error(`Error scraping ${data}: ${err.message}`);
        });
    }

    return cluster;
}
