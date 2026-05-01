import json
import re

with open('temp_new_questions.json', 'r', encoding='utf-8') as f:
    new_questions = json.load(f)

print(f"Loaded {len(new_questions)} new questions")

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pattern = r'const BUILTIN_QUESTIONS=\[([\s\S]*?)\];'
match = re.search(pattern, html)
if not match:
    print("ERROR: BUILTIN_QUESTIONS not found!")
    exit(1)

existing = match.group(1)

js_items = []
for q in new_questions:
    tags_str = json.dumps(q.get('tags', []), ensure_ascii=False)
    item = "{{id:'{id}',title:{title},category:'{cat}',difficulty:'{diff}',content:{content},answer:{answer},sourceType:'builtin',source:{source},tags:{tags}}}".format(
        id=q['id'],
        title=json.dumps(q['title'], ensure_ascii=False),
        cat=q['category'],
        diff=q['difficulty'],
        content=json.dumps(q['content'], ensure_ascii=False),
        answer=json.dumps(q.get('answer', ''), ensure_ascii=False),
        source=json.dumps(q.get('source', ''), ensure_ascii=False),
        tags=tags_str,
    )
    js_items.append(item)

js_code = ','.join(js_items)

if existing.strip():
    insert_pos = match.end() - 2
    new_html = html[:insert_pos] + ',' + js_code + html[insert_pos:]
else:
    new_html = html[:match.start()] + 'const BUILTIN_QUESTIONS=[' + js_code + '];' + html[match.end():]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f"Injected {len(new_questions)} questions into index.html")

# Verify
with open('index.html', 'r', encoding='utf-8') as f:
    html2 = f.read()
m2 = re.search(r'const BUILTIN_QUESTIONS=\[([\s\S]*?)\];', html2)
qs_str = m2.group(1)
categories = {}
for x in re.finditer(r"category:'(\w[\w-]*)'", qs_str):
    c = x.group(1)
    categories[c] = categories.get(c, 0) + 1

print("\nFinal counts:")
total = sum(categories.values())
print(f"Total: {total}")
for c in sorted(categories.keys()):
    cnt = categories[c]
    status = "OK" if cnt >= 200 else f"NEED {200-cnt}"
    print(f"  {c}: {cnt} {status}")
