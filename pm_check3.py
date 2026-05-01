from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    errors = []
    page.on('console', lambda msg: errors.append(f'[{msg.type}] {msg.text}') if msg.type in ['error','warning'] else None)
    page.on('pageerror', lambda err: errors.append(f'[PAGE_ERROR] {err}'))
    
    page.goto('file:///d:/xm/wz/shuati/index.html')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    
    # Check for page errors
    page_errors = [e for e in errors if 'PAGE_ERROR' in e]
    print(f"Page errors: {len(page_errors)}")
    for e in page_errors[:5]:
        print(f"  {e[:200]}")
    
    # Try to find where BUILTIN_QUESTIONS is defined
    try:
        result = page.evaluate("""
            () => {
                try {
                    // Try to access BUILTIN_QUESTIONS
                    if (typeof BUILTIN_QUESTIONS !== 'undefined') {
                        return 'BUILTIN_QUESTIONS exists, length=' + BUILTIN_QUESTIONS.length;
                    } else {
                        return 'BUILTIN_QUESTIONS is undefined';
                    }
                } catch(e) {
                    return 'Error: ' + e.message;
                }
            }
        """)
        print(f"\nBUILTIN_QUESTIONS: {result}")
    except Exception as ex:
        print(f"\nBUILTIN_QUESTIONS check failed: {str(ex)[:200]}")
    
    # Check if CATEGORIES is defined (defined before BUILTIN_QUESTIONS)
    try:
        result = page.evaluate("typeof CATEGORIES")
        print(f"CATEGORIES type: {result}")
    except: 
        print("CATEGORIES: failed to evaluate")
    
    # Check if the script tag even loaded
    try:
        result = page.evaluate("document.querySelectorAll('script').length")
        print(f"Script tags: {result}")
    except:
        print("Script check failed")
    
    browser.close()
