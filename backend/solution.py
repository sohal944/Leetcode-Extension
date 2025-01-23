import sys
import ast

def main():
    # Read input data
    input_data = sys.argv[1]
    
    # Clean up the input data and convert it into a valid format (handle arrays, dictionaries, etc.)
    input_data = input_data.strip()  # Strip any leading/trailing spaces
    
    # Example input parsing logic (adjust as needed based on the problem)
    # Parse input based on format: if the input is a list, convert it to a Python list
    # and if there are other specific inputs, handle them accordingly.
    
    # Handling input assuming it's in the form of a list or dictionary:
    if input_data.startswith('['):  # If it's a list, parse it
        input_data = ast.literal_eval(input_data)  # Safely parse the list
    elif '=' in input_data:  # If it's a named parameter, extract it
        parts = input_data.split('=')
        input_data = parts[-1].strip()  # Get the value after '='
    
    # Your solution logic goes here, for example:
    result = solution(input_data)
    
    # Print the result
    print(result)


def solution(input_data):
    """
    General solution function. You should update this based on the problem.
    This is an example for handling the 'Length of Last Word' problem.
    """
    #START
    # Example logic for a string problem (e.g., 'Length of Last Word')
    if isinstance(input_data, str):
        # Handle string-specific problem (like the 'Length of Last Word' problem)
        words = input_data.strip().split()
        return len(words[-1])
    #END
    # Add other problem-specific logic based on input data type or problem requirements
    return "Solution logic not implemented."


if __name__ == '__main__':
    main()
