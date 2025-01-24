def length_of_last_word(s: str) -> int:
    s = s.strip()  # Remove leading/trailing spaces
    words = s.split(" ")  # Split the string by spaces
    return len(words[-1])  # Return the length of the last word

# Example usage
if __name__ == "__main__":
    s = input()  # Get input from the user
    print(length_of_last_word(s))