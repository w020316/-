from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('file:///d:/xm/wz/shuati/index.html')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    # Dismiss guide
    try:
        page.evaluate("closeGuide()")
        page.wait_for_timeout(300)
    except: pass
    
    # Check categories
    cats = page.evaluate("""
        () => {
            const all = getAllQuestions();
            const dist = {};
            all.forEach(q => { dist[q.category] = (dist[q.category]||0)+1 });
            return {
                total: all.length,
                categories: Object.entries(dist).sort((a,b) => b[1]-a[1]),
                emptyAnswer: all.filter(q => !q.answer || q.answer.trim() === '').length,
                noTags: all.filter(q => !q.tags || !q.tags.length).length,
                newCats: ['finance','law','medical','education','civil-service','hr','marketing'].map(c => ({
                    id: c,
                    count: all.filter(q => q.category === c).length
                }))
            };
        }
    """)
    
    print(f"Total questions: {cats['total']}")
    print(f"Empty answers: {cats['emptyAnswer']}")
    print(f"No tags: {cats['noTags']}")
    print(f"\nCategory distribution:")
    for cat, count in cats['categories']:
        print(f"  {cat}: {count}")
    
    print(f"\nNew professional categories:")
    for c in cats['newCats']:
        print(f"  {c['id']}: {c['count']} questions")
    
    # Check if CATEGORIES array includes new ones
    cat_ids = page.evaluate("CATEGORIES.map(c => c.id)")
    print(f"\nCATEGORIES array: {cat_ids}")
    
    # Check for JS errors
    errors = []
    page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
    page.evaluate("navigate('questions')")
    page.wait_for_timeout(500)
    page.evaluate("navigate('stats')")
    page.wait_for_timeout(500)
    page.evaluate("navigate('dashboard')")
    page.wait_for_timeout(500)
    
    if errors:
        print(f"\nJS Errors: {errors[:5]}")
    else:
        print("\nNo JS errors!")
    
    browser.close()
