const https = require('https');

const tagMap = {
  'array': 'algorithm', 'hash-table': 'algorithm', 'linked-list': 'algorithm',
  'math': 'algorithm', 'two-pointers': 'algorithm', 'sliding-window': 'algorithm',
  'stack': 'algorithm', 'queue': 'algorithm', 'heap': 'algorithm',
  'greedy': 'algorithm', 'dynamic-programming': 'algorithm',
  'divide-and-conquer': 'algorithm', 'backtracking': 'algorithm',
  'tree': 'algorithm', 'binary-tree': 'algorithm', 'graph': 'algorithm',
  'depth-first-search': 'algorithm', 'breadth-first-search': 'algorithm',
  'binary-search': 'algorithm', 'sort': 'algorithm', 'recursion': 'algorithm',
  'trie': 'algorithm', 'monotonic-stack': 'algorithm', 'bit-manipulation': 'algorithm',
  'database': 'database', 'shell': 'os', 'concurrency': 'os',
  'design': 'system-design', 'javascript': 'frontend',
};

const diffMap = { 'EASY': 'easy', 'MEDIUM': 'medium', 'HARD': 'hard' };

function fetchGraphQL(query, variables) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const req = https.request('https://leetcode.cn/graphql/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function fetchAllProblems() {
  const allProblems = [];
  let skip = 0;
  const batchSize = 50;

  while (true) {
    const query = `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
        total questions { questionFrontendId title titleCn titleSlug difficulty acRate topicTags { name nameTranslated slug } }
      }
    }`;

    const result = await fetchGraphQL(query, { categorySlug: '', limit: batchSize, skip, filters: {} });
    const questions = result?.data?.problemsetQuestionList?.questions || [];
    if (!questions.length) break;

    for (const q of questions) {
      const tags = q.topicTags || [];
      let cat = 'algorithm';
      for (const t of tags) {
        if (tagMap[t.slug]) { cat = tagMap[t.slug]; break; }
      }
      const tagNames = tags.map(t => t.nameTranslated || t.name).filter(Boolean);
      const title = q.titleCn || q.title;

      allProblems.push({
        id: `lc-${q.questionFrontendId}`,
        title: `LC${q.questionFrontendId}: ${title}`,
        category: cat,
        difficulty: diffMap[q.difficulty] || 'medium',
        content: `LeetCode #${q.questionFrontendId}\nhttps://leetcode.cn/problems/${q.titleSlug}/\n通过率: ${(q.acRate * 100).toFixed(1)}%`,
        answer: '',
        sourceType: 'builtin',
        source: `LeetCode #${q.questionFrontendId}`,
        tags: tagNames,
        acRate: q.acRate ? `${(q.acRate * 100).toFixed(1)}%` : '',
        titleSlug: q.titleSlug,
      });
    }

    const total = result?.data?.problemsetQuestionList?.total || 0;
    console.log(`Fetched ${questions.length} (skip=${skip}), total so far: ${allProblems.length}/${total}`);
    if (allProblems.length >= total) break;
    skip += batchSize;
  }

  return allProblems;
}

async function main() {
  console.log('Fetching all problems from LeetCode...');
  const problems = await fetchAllProblems();
  console.log(`Total problems fetched: ${problems.length}`);

  const fs = require('fs');
  fs.writeFileSync('data/problems.json', JSON.stringify(problems, null, 2));
  console.log('Saved to data/problems.json');

  const stats = { easy: 0, medium: 0, hard: 0 };
  const cats = {};
  for (const q of problems) {
    stats[q.difficulty] = (stats[q.difficulty] || 0) + 1;
    cats[q.category] = (cats[q.category] || 0) + 1;
  }
  console.log(`Easy: ${stats.easy}, Medium: ${stats.medium}, Hard: ${stats.hard}`);
  console.log('Categories:', cats);
}

main().catch(console.error);
