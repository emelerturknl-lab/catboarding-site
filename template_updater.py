import re
import sys

pages = {
    'about.html': {'nav': 'about.html', 'title': 'About Us', 'desc': "Welcome to Black Princess & White Prince — your cat's second home in Almere. We believe every cat deserves a peaceful, loving, and stress-free environment when their family is away."},
    'services.html': {'nav': 'services.html', 'title': 'Our Services', 'desc': 'Premium in-home cat boarding. We offer a cage-free, safe, and clean environment. Features include daily playtime, regular updates via WhatsApp, and personalized attention.'},
    'pricing.html': {'nav': 'pricing.html', 'title': 'Pricing & Campaigns', 'desc': '€20 per night (1 cat)<br> €35 per night (2 cats)<br><br>Check out our seasonal campaigns and long-term stay discounts!'},
    'rules.html': {'nav': 'rules.html', 'title': 'Boarding Rules', 'desc': '1. All cats must be vaccinated & neutered.<br>2. Flea & worm treatments must be up to date.<br>3. Provide your own food to prevent stomach issues.'},
    'blog.html': {'nav': 'blog.html', 'title': 'Cat Boarding Blog', 'desc': 'Read our latest tips and stories on cat behavior, nutrition, and happy boarding experiences. (Articles coming soon)'},
    'gallery.html': {'nav': 'gallery.html', 'title': 'Memory Basket', 'desc': 'A beautiful gallery of our happy guests. (Gallery coming soon)'}
}

for file, data in pages.items():
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Update Nav
    html = html.replace('href="index.html" class="active"', 'href="index.html"')
    html = html.replace(f'href="{data["nav"]}"', f'href="{data["nav"]}" class="active"')

    # Replace inner content
    inner_start = html.find('<div class="inner">') + len('<div class="inner">')
    inner_end = html.rfind('</div>\n</div>\n</div>\n<!-- JS') 
    
    if inner_start > len('<div class="inner">') and inner_end > -1:
        new_content = f"""
<div id="image03" class="image-component instance-3">
<span class="frame deferred" style="background-image: none; background-size: 100% 100%; background-position: left top; background-repeat: no-repeat;">
<img src="assets/images/logo3.png" data-src="done" alt="black cat with green eyes in home environment" style="opacity: 1;">
</span>
</div>
<h1 id="text01" class="text-component instance-1 style-1" style="opacity: 1; transform: none; font-size: 2.5em; margin-bottom: 2rem;">{data['title']}</h1>
<p id="text04" class="text-component instance-4 style-1" style="opacity: 1; transform: none; max-width: 800px; margin: 0 auto; line-height: 1.6;">{data['desc']}</p>
<ul id="buttons02" class="buttons-component instance-2" style="margin-top: 3rem;">
<li><a href="https://wa.me/31615677962?text=Hi%20I%20would%20like%20to%20check%20availability%20for%20cat%20boarding" class="n01" role="button">Check Availability on WhatsApp</a></li>
</ul>
"""
        html = html[:inner_start] + new_content + html[inner_end:]

    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)

print("Updated all files successfully.")
