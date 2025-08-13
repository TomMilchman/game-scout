"use server";

import puppeteer, { Browser } from "puppeteer";

let browser: Browser | null = null;

export async function getBrowser() {
    if (browser) return browser;

    browser = await puppeteer.launch({
        headless: true,
        devtools: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: null,
    });

    return browser;
}

export async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
    }
}
