from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    errors = []
    page.on('console', lambda msg: errors.append(f'[{msg.type}] {msg.text}') if msg.type in ['error','warning'] else None)
    
    page.goto('file:///d:/xm/wz/shuati/index.html')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    
    print(f"Console errors: {len([e for e in errors if '[error]' in e])}")
    for e in errors[:20]:
        print(f"  {e}")
    
    # Try to evaluate simple JS
    try:
        result = page.evaluate("1+1")
        print(f"Basic JS works: 1+1={result}")
    except Exception as ex:
        print(f"Basic JS failed: {ex}")
    
    # Try BUILTIN_QUESTIONS
    try:
        result = page.evaluate("typeof BUILTIN_QUESTIONS")
        print(f"BUILTIN_QUESTIONS type: {result}")
    except Exception as ex:
        print(f"BUILTIN_QUESTIONS failed: {ex}")
    
    # Try getAllQuestions
    try:
        result = page.evaluate("typeof getAllQuestions")
        print(f"getAllQuestions type: {result}")
    except Exception as ex:
        print(f"getAllQuestions failed: {ex}")
    
    browser.close()
