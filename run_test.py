from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

try:
    driver = webdriver.Chrome(options=options)
    driver.get("http://localhost:8082/admin-reservations.html")
    time.sleep(1)
    
    # We can inject JS to bypass login
    driver.execute_script("""
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        openNewBookingModal('2026-04-28', '2026-05-03');
    """)
    time.sleep(1)
    
    # Fill out form
    driver.execute_script("""
        document.getElementById('customerName').value = 'Test User';
        document.getElementById('customerContact').value = '123456';
    """)
    
    # Click save
    driver.execute_script("document.getElementById('save-btn').click();")
    time.sleep(1)
    
    # Check for alerts
    try:
        alert = driver.switch_to.alert
        print("ALERT FOUND:", alert.text)
        alert.accept()
    except:
        print("NO ALERT FOUND")
        
    # Check console logs
    for entry in driver.get_log('browser'):
        print(entry)
        
    driver.quit()
except Exception as e:
    print("Error:", e)
