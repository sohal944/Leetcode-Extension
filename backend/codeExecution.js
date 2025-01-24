const { exec } = require('child_process');
const fs = require('fs');

// Function to run Python code
const runPythonCode = (pythonCode) => {
    return new Promise((resolve, reject) => {
        // Write Python code to a temporary file
        const pythonFileName = 'solution.py';
        fs.writeFileSync(pythonFileName, pythonCode);

        // Execute Python file using child_process exec
        exec(`python ${pythonFileName}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing Python code: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Function to run C++ code
const runCppCode = (cppCode) => {
    return new Promise((resolve, reject) => {
        // Write C++ code to a temporary file
        const cppFileName = 'solution.cpp';
        fs.writeFileSync(cppFileName, cppCode);

        // Compile the C++ code and run it using child_process exec
        exec(`g++ ${cppFileName} -o solution && ./solution`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing C++ code: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Export the functions to be used in the main process
module.exports = {
    runPythonCode,
    runCppCode
};
