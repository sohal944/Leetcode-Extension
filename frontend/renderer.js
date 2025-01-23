const { ipcRenderer } = require('electron');

// Fetch problem data when the button is clicked
document.getElementById('fetchBtn').addEventListener('click', () => {
    const url = document.getElementById('url').value.trim();
    
    // Check if URL is empty and display error message
    if (!url) {
        document.getElementById('errorMessage').innerText = 'Please enter a valid LeetCode problem URL.';
        return; // Stop further execution if URL is empty
    }

    // Clear error message if URL is valid
    document.getElementById('errorMessage').innerText = '';

    // Send URL to the main process for scraping test cases
    ipcRenderer.send('fetchProblemData', url);
});

// Listen for problem data and display it
ipcRenderer.on('problemData', (event, { problemStatement, testCases }) => {
    document.getElementById('problemStatement').innerText = problemStatement;

    // Display test cases more clearly
    const testCasesDisplay = testCases.map((testCase, index) => {
        return `Test Case ${index + 1}:\nInput: ${testCase.input}\nOutput: ${testCase.output}\n\n`;
    }).join('');
    
    document.getElementById('testCases').innerText = testCasesDisplay;
});

// Run solution when the button is clicked
document.getElementById('runSolutionBtn').addEventListener('click', () => {
    const pythonCode = document.getElementById('solutionPyCode').value.trim();
    const cppCode = document.getElementById('solutionCppCode').value.trim();

    // Send solution codes to the main process to run
    ipcRenderer.send('runSolution', { pythonCode, cppCode });
});

// Listen for solution output and display it
ipcRenderer.on('solutionOutput', (event, output) => {
    document.getElementById('output').innerText = output;
});

