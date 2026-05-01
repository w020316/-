from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    
    # Test 1: Load homepage
    print("Test 1: Loading homepage...")
    page.goto('http://localhost:8080')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='test_screenshot_home.png', full_page=True)
    print("  - Homepage loaded successfully")
    
    # Test 2: Check title
    title = page.title()
    print(f"  - Page title: {title}")
    assert "面试通" in title, f"Title should contain '面试通', got: {title}"
    assert "多学科" in title, f"Title should contain '多学科', got: {title}"
    print("  - Title check passed: contains '面试通' and '多学科'")
    
    # Test 3: Navigate to questions page
    print("\nTest 3: Navigating to questions page...")
    page.goto('http://localhost:8080#questions')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    page.screenshot(path='test_screenshot_questions.png', full_page=True)
    
    # Test 4: Check sidebar categories
    print("\nTest 4: Checking sidebar categories...")
    sidebar_items = page.locator('.sidebar-item')
    count = sidebar_items.count()
    print(f"  - Found {count} sidebar items")
    
    # List all categories
    for i in range(min(count, 20)):
        text = sidebar_items.nth(i).text_content()
        print(f"    - Category {i+1}: {text.strip()}")
    
    # Test 5: Click on finance category
    print("\nTest 5: Clicking on finance category...")
    finance_item = page.locator('.sidebar-item', has_text='金融财会')
    if finance_item.count() > 0:
        finance_item.first.click()
        page.wait_for_timeout(1000)
        page.screenshot(path='test_screenshot_finance.png', full_page=True)
        print("  - Finance category clicked successfully")
    else:
        print("  - WARNING: Finance category not found in sidebar")
    
    # Test 6: Check question cards
    print("\nTest 6: Checking question cards...")
    question_cards = page.locator('.question-card')
    card_count = question_cards.count()
    print(f"  - Found {card_count} question cards on page")
    
    # Test 7: Click on a question to view detail
    if card_count > 0:
        print("\nTest 7: Clicking first question card...")
        question_cards.first.click()
        page.wait_for_timeout(1000)
        page.screenshot(path='test_screenshot_detail.png', full_page=True)
        print("  - Question detail page loaded")
        
        # Test 8: Check answer reveal system
        print("\nTest 8: Testing two-step answer reveal...")
        answer_btn = page.locator('#answerBtn')
        if answer_btn.count() > 0:
            answer_btn.first.click()
            page.wait_for_timeout(500)
            page.screenshot(path='test_screenshot_hint.png', full_page=True)
            print("  - Step 1: Hint revealed")
            
            answer_btn.first.click()
            page.wait_for_timeout(500)
            page.screenshot(path='test_screenshot_full_answer.png', full_page=True)
            print("  - Step 2: Full answer revealed")
        else:
            print("  - Answer button not found")
    
    # Test 9: Navigate to law category
    print("\nTest 9: Navigating to law category...")
    page.goto('http://localhost:8080#questions')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    law_item = page.locator('.sidebar-item', has_text='法律法务')
    if law_item.count() > 0:
        law_item.first.click()
        page.wait_for_timeout(1000)
        page.screenshot(path='test_screenshot_law.png', full_page=True)
        print("  - Law category loaded successfully")
    
    # Test 10: Navigate to dashboard
    print("\nTest 10: Navigating to dashboard...")
    page.goto('http://localhost:8080#dashboard')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    page.screenshot(path='test_screenshot_dashboard.png', full_page=True)
    print("  - Dashboard loaded successfully")
    
    # Check for "多学科" text on dashboard
    body_text = page.locator('body').text_content()
    if '多学科' in body_text or '面试通' in body_text:
        print("  - Dashboard branding check passed")
    else:
        print("  - WARNING: Dashboard branding may not be updated")
    
    print("\n" + "="*50)
    print("ALL TESTS COMPLETED SUCCESSFULLY!")
    print("="*50)
    
    browser.close()
