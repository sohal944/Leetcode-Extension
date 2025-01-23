const fs = require('fs');
const { exec } = require('child_process');

// Function to normalize output for comparison
function normalizeOutput(output) {
    return output.replace(/\s+/g, '').trim();
}

// Function to parse test cases from JSON
function parseTestCases() {
    const data = fs.readFileSync('problem_data.json', 'utf8');
    const parsed = JSON.parse(data);
    return { problemId: parsed.title ? parsed.title.split('.')[1].trim() : "Unknown", testCases: parsed.testCases };
}

// Function to run Python code (solution.py)
function runPythonCode(input) {
    return new Promise((resolve, reject) => {
        // Pass input to Python script
        exec(`python solution.py "${input}"`, (err, stdout, stderr) => {
            if (err) {
                reject(`Python error: ${stderr}`);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

// Function to run C++ code (solution.cpp)
function runCppCode(input) {
    return new Promise((resolve, reject) => {
        // Convert input array into space-separated values for C++
        const formattedInput = input.split(' ').join(' '); // Format as space-separated values
        
        // Pass input to C++ code (ensure proper format)
        exec(`g++ solution.cpp -o solution && solution.exe "${formattedInput}"`, (err, stdout, stderr) => {
            if (err) {
                reject(`C++ error: ${stderr}`);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

// Function to process test cases
async function processTestCases() {
    const { problemId, testCases } = parseTestCases();

    for (let i = 0; i < testCases.length; i++) {
        const { input, output } = testCases[i];
        const inputValue = input[0]; // Extract the first element from the input array

        console.log(`\nProcessing Test Case ${i + 1} for ${problemId}:`);
        console.log(`Input: ${inputValue}`);
        console.log(`Expected Output: ${output}`);

        // Run Python code
        try {
            const pythonOutput = await runPythonCode(inputValue);
            console.log(`Python Output: ${pythonOutput}`);
            console.log(`Python Test Passed: ${normalizeOutput(pythonOutput) === normalizeOutput(output)}`);
        } catch (err) {
            console.log(err);
        }

        // Run C++ code
        try {
            const cppOutput = await runCppCode(inputValue);
            console.log(`C++ Output: ${cppOutput}`);
            console.log(`C++ Test Passed: ${normalizeOutput(cppOutput) === normalizeOutput(output)}`);
        } catch (err) {
            console.log(err);
        }
    }
}

processTestCases();
