import re
with open('admin-reservations.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Look at the exact saveBookingManually
match = re.search(r'async function saveBookingManually\(\) \{.*?(?=async function|</script>)', text, re.DOTALL)
if match:
    print(match.group(0))
