import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
pattern = r'const BUILTIN_QUESTIONS=\[([\s\S]*?)\];'
match = re.search(pattern, html)
if not match:
    print('BUILTIN_QUESTIONS not found!')
    exit()
questions_str = match.group(1)
categories = {}
for m in re.finditer(r"category:'(\w[\w-]*)'", questions_str):
    cat = m.group(1)
    categories[cat] = categories.get(cat, 0) + 1
total = sum(categories.values())
print(f'Total questions: {total}')
for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
    print(f'  {cat}: {count}')
