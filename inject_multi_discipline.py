#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将多学科面试题注入到index.html的BUILTIN_QUESTIONS数组
"""

import json
import re

def inject_questions():
    # 读取生成的题目
    with open('generated_multi_discipline_v2.json', 'r', encoding='utf-8') as f:
        all_new_questions = json.load(f)
    
    print("读取到的新题目：")
    total = 0
    for cat_id, questions in all_new_questions.items():
        print(f"  - {cat_id}: {len(questions)} 题")
        total += len(questions)
    print(f"\n总计: {total} 道新题目")
    
    # 读取index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到BUILTIN_QUESTIONS数组的结束位置
    # 查找 ]; 标记数组结束
    pattern = r'(const BUILTIN_QUESTIONS=\[)(.*?)(\];)'
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print("错误：未找到BUILTIN_QUESTIONS数组")
        return
    
    print("\n找到BUILTIN_QUESTIONS数组，开始注入新题目...")
    
    # 将所有新题目转换为JavaScript对象格式
    new_questions_js = []
    for cat_id, questions in all_new_questions.items():
        for q in questions:
            # 转义特殊字符
            title = q['title'].replace("'", "\\'").replace('"', '\\"').replace('\n', '\\n')
            description = q.get('description', '').replace("'", "\\'").replace('"', '\\"').replace('\n', '\\n')
            answer = q['answer'].replace("'", "\\'").replace('"', '\\"').replace('\n', '\\n')
            tags_str = json.dumps(q['tags'], ensure_ascii=False)
            
            question_str = f"""{{
id:'{q['id']}',
title:'{title}',
category:'{q['category']}',
difficulty:'{q['difficulty']}',
tags:{tags_str},
description:'{description}',
answer:'{answer}'
}}"""
            new_questions_js.append(question_str)
    
    # 在原有数组末尾添加新题目（在];之前）
    old_array_content = match.group(2)
    new_array_content = old_array_content + ',\n' + ',\n'.join(new_questions_js)
    
    # 替换内容
    new_content = content[:match.start(2)] + new_array_content + content[match.end(2):]
    
    # 写回文件
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"[OK] 成功注入 {len(new_questions_js)} 道新题目到index.html")


if __name__ == '__main__':
    inject_questions()
