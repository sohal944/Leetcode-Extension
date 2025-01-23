const { app, BrowserWindow, ipcMain } = require('electron');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile("frontend/index.html");
    mainWindow.webContents.openDevTools();

}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Listen for the 'fetchProblemData' event from the renderer process
ipcMain.on('fetchProblemData', async (event, url) => {
    try {
        console.log('Fetching problem data for URL:', url);  // Debugging log
        const problemData = await scrapeLeetcodeProblem(url);
        mainWindow.webContents.send('problemData', problemData);
    } catch (error) {
        console.error("Error fetching problem data:", error);
    }
});

// Listen for the 'runSolution' event from the renderer process
ipcMain.on('runSolution', async (event, { pythonCode, cppCode }) => {
    try {
        console.log('Running solution for Python and C++');  // Debugging log
        const pythonResult = await runPythonCode(pythonCode);
        const cppResult = await runCppCode(cppCode);
        mainWindow.webContents.send('solutionOutput', `Python Output: ${pythonResult}\nC++ Output: ${cppResult}`);
    } catch (error) {
        console.error("Error running solution:", error);
    }
});

// Function to scrape LeetCode problem data
async function scrapeLeetcodeProblem(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector('.text-title-large.font-semibold.text-text-primary');
    const problemStatement = await page.$eval('.question-description', el => el.innerText);

    await page.waitForSelector('pre');
    const testCases = await page.$$eval('pre', elements => {
        return elements.map(element => {
            const [inputPart, outputPart] = element.innerText.split("\nOutput:");
            const input = inputPart.replace("Input:", "").trim();
            const output = outputPart.trim().split("\n")[0];
            return { input, output };
        });
    });

    await browser.close();
    return { problemStatement, testCases };
}

// Function to run Python code
function runPythonCode(code) {
    return new Promise((resolve, reject) => {
        fs.writeFileSync('solution.py', code);
        exec('python solution.py', (err, stdout, stderr) => {
            if (err) reject(stderr);
            resolve(stdout.trim());
        });
    });
}

// Function to run C++ code
function runCppCode(code) {
    return new Promise((resolve, reject) => {
        fs.writeFileSync('solution.cpp', code);
        exec('g++ solution.cpp -o solution && ./solution', (err, stdout, stderr) => {
            if (err) reject(stderr);
            resolve(stdout.trim());
        });
    });
}
