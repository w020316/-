import json
import re

with open('new_questions.json', 'r', encoding='utf-8') as f:
    new_questions = json.load(f)

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the end of BUILTIN_QUESTIONS array
pattern = r'const BUILTIN_QUESTIONS=\[([\s\S]*?)\];'
match = re.search(pattern, html)
if not match:
    print("Could not find BUILTIN_QUESTIONS!")
    exit(1)

# Generate JS code for new questions
js_items = []
for q in new_questions:
    tags_str = json.dumps(q.get('tags', []), ensure_ascii=False)
    item = f"{{id:'{q['id']}',title:{json.dumps(q['title'], ensure_ascii=False)},category:'{q['category']}',difficulty:'{q['difficulty']}',content:{json.dumps(q['content'], ensure_ascii=False)},answer:{json.dumps(q.get('answer',''), ensure_ascii=False)},sourceType:'builtin',source:{json.dumps(q['source'], ensure_ascii=False)},tags:{tags_str}}}"
    js_items.append(item)

js_code = ','.join(js_items)

# Insert after existing questions
insert_pos = match.end() - 2  # Before the closing '];'
new_html = html[:insert_pos] + ',' + js_code + html[insert_pos:]

# Update question count in descriptions
existing_count = match.group(1).count('{id:')
total = existing_count + len(new_questions)
new_html = new_html.replace('503+精选面试题', f'{total}+精选面试题')
new_html = new_html.replace('503+ 精选面试题', f'{total}+ 精选面试题')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f"Added {len(new_questions)} new questions")
print(f"Total: {existing_count} + {len(new_questions)} = {total}")
