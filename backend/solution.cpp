#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

// Function to compute the length of the last word
class Solution {
public:
    int lengthOfLastWord(string s) {
        // Trim trailing spaces
        int len = s.length();
        int end = len - 1;
        
        // Skip trailing spaces
        while (end >= 0 && s[end] == ' ') {
            end--;
        }

        // Find the length of the last word
        int start = end;
        while (start >= 0 && s[start] != ' ') {
            start--;
        }

        // Return the length of the last word
        return end - start;
    }
};

int main(int argc, char* argv[]) {
    // Input parsing
    if (argc != 2) {
        cout << "Usage: solution.exe <input_string>" << endl;
        return 1;
    }
    
    string input = argv[1]; // Input string
    
    // Create Solution object and compute the result
    Solution solution;
    int result = solution.lengthOfLastWord(input);
    
    // Output the result
    cout << result << endl;

    return 0;
}
