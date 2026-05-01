import re

with open('d:/xm/wz/shuati/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the new professional questions section
# The problem is that the answer fields contain actual newlines instead of \n
# We need to fix the data between the last LC question and DEFAULT_SOURCES

# Strategy: find all {id:'fin-... through {id:'mkt-...} entries and fix them
# The new questions start with {id:'fin-1' and end before const DEFAULT_SOURCES

start_marker = "{id:'fin-1'"
end_marker = "const DEFAULT_SOURCES=["

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"ERROR: markers not found! start={start_idx}, end={end_idx}")
    exit(1)

print(f"Found new questions section: {start_idx} to {end_idx}")
print(f"Section length: {end_idx - start_idx}")

# Extract the section
section = content[start_idx:end_idx]

# Fix: replace actual newlines inside string values with \n
# This is tricky because we need to preserve the structure
# The issue is that answer strings span multiple lines with actual newlines

# Strategy: rebuild the section by parsing each question object
# and ensuring all string values use \n instead of actual newlines

# Simple approach: replace actual newlines that are inside single-quoted strings
# We can detect this by checking if we're inside a string

result = []
in_string = False
string_char = None
i = 0
while i < len(section):
    c = section[i]
    
    if not in_string:
        if c in ("'", '"'):
            in_string = True
            string_char = c
            result.append(c)
        else:
            result.append(c)
    else:
        if c == '\\' and i + 1 < len(section):
            # Escaped character, keep as is
            result.append(c)
            result.append(section[i+1])
            i += 2
            continue
        elif c == string_char:
            in_string = False
            result.append(c)
        elif c == '\n':
            # Actual newline inside string - replace with \n
            result.append('\\n')
        elif c == '\r':
            # Skip carriage return
            pass
        else:
            result.append(c)
    
    i += 1

fixed_section = ''.join(result)

# Reconstruct the file
new_content = content[:start_idx] + fixed_section + content[end_idx:]

with open('d:/xm/wz/shuati/index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Fixed! Original section: {len(section)} chars, Fixed: {len(fixed_section)} chars")
