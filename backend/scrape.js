const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLeetcodeProblem(url) {
    const browser = await puppeteer.launch({ headless: false }); // Set to true for production
    const page = await browser.newPage();

    try {
        console.log(`Navigating to ${url}`);
        await page.goto(url);

        // Wait for the problem title element
        await page.waitForSelector('.text-title-large.font-semibold.text-text-primary');

        // Scrape the problem title
        const title = await page.$eval('.text-title-large.font-semibold.text-text-primary', element => element.innerText);
        console.log(`Title: ${title}`);

        // Wait for the test case elements
        await page.waitForSelector('pre');
        const testCases = await page.$$eval('pre', elements =>
            elements.map(element => {
                const text = element.innerText.trim();
                const [inputPart, outputPart] = text.split("\nOutput:");
                if (inputPart && outputPart) {
                    // Extract the input value by removing the variable assignment and quotes
                    const input = inputPart.replace("Input:", "").trim().replace(/s\s?=\s?/, "").replace(/^"|"$/g, ""); // Remove surrounding quotes
                    const output = outputPart.trim().split("\n")[0]; // Only take the first line of output
                    return { input: [input], output }; // Store input as an array
                }
                return null;
            }).filter(Boolean) // Filter out invalid test cases
        );

        // Save data to JSON
        const data = {
            testCases: testCases,
        };

        const outputPath = './problem_data.json';
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Data saved to ${outputPath}`);
    } catch (error) {
        console.error("Error scraping problem:", error.message);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
}

// Replace with your desired LeetCode problem URL
const url = "https://leetcode.com/problems/length-of-last-word/description/";
scrapeLeetcodeProblem(url);

module.exports = { scrapeLeetcodeProblem };
