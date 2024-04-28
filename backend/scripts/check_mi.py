# check_mi.py
import sys
import json


def main():
    data = json.load(sys.stdin)
    total_score = 0
    count = 0
    for item in data:
        total_score += item["mi"]
        count += 1
    if count > 0:
        average_score = total_score / count
        print(int(average_score))  # Print to stdout to capture in shell
    else:
        print(100)  # Default to a perfect score if no files were processed


if __name__ == "__main__":
    main()
