const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const puppeteer = require('puppeteer');
const { scrapeLeetcodeProblem } = require('./scrape');  // Importing scrape function
const { runPythonCode, runCppCode } = require('./codeExecution');  // Importing helper functions for code execution

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Ensure context isolation is off for debugging
            devTools: true // Enable DevTools
        }
    });

    mainWindow.loadFile("frontend/index.html");
    mainWindow.webContents.openDevTools(); // Automatically open DevTools on app launch
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady().then(() => {
    createWindow();

    // Add a global shortcut for toggling DevTools
    globalShortcut.register('CommandOrControl+Shift+I', () => {
        mainWindow.webContents.toggleDevTools();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('will-quit', () => {
    // Unregister all shortcuts when the app is about to quit
    globalShortcut.unregisterAll();
});

// Fetch LeetCode problem data
ipcMain.on('fetchProblemData', async (event, url) => {
    try {
        console.log('Fetching problem data for URL:', url);
        const problemData = await scrapeLeetcodeProblem(url);

        // Send the data back to the frontend
        mainWindow.webContents.send('problemData', problemData);
    } catch (error) {
        console.error("Error fetching problem data:", error);
    }
});


// Run Python and C++ solution codes
ipcMain.on('runSolution', async (event, { pythonCode, cppCode }) => {
    try {
        console.log('Running solution for Python and C++');
        const pythonResult = await runPythonCode(pythonCode); // Run the Python code
        const cppResult = await runCppCode(cppCode); // Run the C++ code
        mainWindow.webContents.send('solutionOutput', `Python Output: ${pythonResult}\nC++ Output: ${cppResult}`); // Send output back to the renderer
    } catch (error) {
        console.error("Error running solution:", error);
    }
});
