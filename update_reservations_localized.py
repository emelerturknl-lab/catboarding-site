import os
import re

def update_reservation_localized(lang, translations):
    base_dir = '/Users/emelerturk/Desktop/BLACK PRINCESS& WHITE PRINCE'
    file_path = os.path.join(base_dir, lang, 'reservation.html')
    
    if not os.path.exists(file_path): 
        print(f"Skipping {file_path}")
        return
    
    with open(file_path, 'r') as f:
        html = f.read()
    
    t = translations
    
    new_form_inner = f"""    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 200px;">
        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; color: #4A4A4A;">{t['dropoff_date']}</label>
        <input type="date" name="dropoff-date" id="dropoff-date" required onchange="calculatePricing()" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; color: #4A4A4A;">{t['dropoff_time']}</label>
        <input type="time" name="dropoff-time" id="dropoff-time" required onchange="calculatePricing()" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
      </div>
    </div>

    <div style="margin-top: -0.5rem; margin-bottom: 1rem;">
      <label style="display: flex; align-items: center; gap: 0.5rem; font-family: sans-serif; font-size: 0.95rem; color: #4A4A4A; cursor: pointer;">
        <input type="checkbox" name="transfer-dropoff" id="transfer-dropoff" onchange="toggleTransfer('dropoff'); calculatePricing();"> {t['need_transfer_dropoff']}
      </label>
      <div id="transfer-dropoff-options" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(217, 163, 163, 0.1); border-radius: 8px;">
        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; font-size: 0.9rem;">{t['dropoff_loc']}</label>
        <select name="dropoff-location-select" id="dropoff-location-select" onchange="handleLocationChange('dropoff'); calculatePricing();" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.95rem; background: white; margin-bottom: 0.5rem;">
          <option value="">{t['select_loc']}</option>
          <option value="Schiphol">{t['loc_schiphol']} (€65)</option>
          <option value="Amsterdam">{t['loc_amsterdam']} (€50)</option>
          <option value="Hoofddorp">{t['loc_hoofddorp']} (€60)</option>
          <option value="Lelystad">{t['loc_lelystad']} (€45)</option>
          <option value="Custom">{t['loc_custom']}</option>
        </select>
        <div id="dropoff-custom-address" style="display: none;">
          <input type="text" name="dropoff-address" id="dropoff-address" placeholder="{t['address_placeholder']}" onchange="calculatePricing()" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.95rem;">
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 200px;">
        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; color: #4A4A4A;">{t['pickup_date']}</label>
        <input type="date" name="pickup-date" id="pickup-date" required onchange="calculatePricing()" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; color: #4A4A4A;">{t['pickup_time']}</label>
        <input type="time" name="pickup-time" id="pickup-time" required onchange="calculatePricing()" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
      </div>
    </div>

    <div style="margin-top: -0.5rem; margin-bottom: 1rem;">
      <label style="display: flex; align-items: center; gap: 0.5rem; font-family: sans-serif; font-size: 0.95rem; color: #4A4A4A; cursor: pointer;">
        <input type="checkbox" name="transfer-pickup" id="transfer-pickup" onchange="toggleTransfer('pickup'); calculatePricing();"> {t['need_transfer_pickup']}
      </label>
      <div id="transfer-pickup-options" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(217, 163, 163, 0.1); border-radius: 8px;">
        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; font-size: 0.9rem;">{t['pickup_loc']}</label>
        <select name="pickup-location-select" id="pickup-location-select" onchange="handleLocationChange('pickup'); calculatePricing();" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.95rem; background: white; margin-bottom: 0.5rem;">
          <option value="">{t['select_loc']}</option>
          <option value="Schiphol">{t['loc_schiphol']} (€65)</option>
          <option value="Amsterdam">{t['loc_amsterdam']} (€50)</option>
          <option value="Hoofddorp">{t['loc_hoofddorp']} (€60)</option>
          <option value="Lelystad">{t['loc_lelystad']} (€45)</option>
          <option value="Custom">{t['loc_custom']}</option>
        </select>
        <div id="pickup-custom-address" style="display: none;">
          <input type="text" name="pickup-address" id="pickup-address" placeholder="{t['address_placeholder']}" onchange="calculatePricing()" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.95rem;">
        </div>
      </div>
    </div>

    <div style="width: 100%;">
      <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; color: #4A4A4A;">{t['cat_count']}</label>
      <select name="cat-count" id="cat-count" onchange="calculatePricing()" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; box-sizing: border-box; background: white;">
        <option value="1">{t['cat_1']} (€20/night)</option>
        <option value="2">{t['cat_2']} (€35/night)</option>
      </select>
    </div>

    <!-- Pricing Summary Section -->
    <div id="pricing-summary" style="padding: 1.5rem; border: 2px solid #D9A3A3; border-radius: 12px; background: rgba(255, 255, 255, 0.9); font-family: sans-serif; color: #4A4A4A; margin-bottom: 1rem;">
      <h3 style="margin-bottom: 1rem; color: #D9A3A3; font-family: 'Dancing Script', cursive !important; font-size: 1.5rem;">{t['summary_title']}</h3>
      <div id="summary-content">
        <p style="font-style: italic; color: #888;">{t['summary_placeholder']}</p>
      </div>
      <input type="hidden" name="estimated-total" id="estimated-total" value="0">
    </div>

    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 200px;">
          <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; color: #4A4A4A;">{t['name']}</label>
          <input type="text" name="name" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
      </div>
      <div style="flex: 1; min-width: 200px;">
          <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; color: #4A4A4A;">{t['contact']}</label>
          <input type="text" name="contact" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
      </div>
    </div>
    <div style="width: 100%;">
        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-family: sans-serif; color: #4A4A4A;">{t['notes']}</label>
        <textarea name="message" placeholder="{t['notes_placeholder']}" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; box-sizing: border-box; height: 100px; resize: vertical; font-family: sans-serif;"></textarea>
    </div>
    <button type="submit" style="background-color: #D9A3A3; color: white; border: none; padding: 15px; border-radius: 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: background 0.3s; margin-top: 1rem;">{t['submit_btn']}</button>
"""

    form_pattern = re.compile(r'(<form.*?>).*?(</form>)', re.DOTALL)
    html = form_pattern.sub(r'\1' + new_form_inner + r'\2', html)
    
    script_logic = f"""
function toggleTransfer(type) {{
  const checkbox = document.getElementById('transfer-' + type);
  const optionsDiv = document.getElementById('transfer-' + type + '-options');
  optionsDiv.style.display = checkbox.checked ? 'block' : 'none';
}}

function handleLocationChange(type) {{
  const select = document.getElementById(type + '-location-select');
  const customDiv = document.getElementById(type + '-custom-address');
  customDiv.style.display = select.value === 'Custom' ? 'block' : 'none';
}}

async function calculatePricing() {{
  const dropDateVal = document.getElementById('dropoff-date').value;
  const dropTimeVal = document.getElementById('dropoff-time').value || '12:00';
  const pickDateVal = document.getElementById('pickup-date').value;
  const pickTimeVal = document.getElementById('pickup-time').value || '12:00';
  
  if (!dropDateVal || !pickDateVal) return;
  
  const dropoffDate = new Date(dropDateVal + 'T' + dropTimeVal);
  const pickupDate = new Date(pickDateVal + 'T' + pickTimeVal);
  const catCount = parseInt(document.getElementById('cat-count').value);
  const summaryContent = document.getElementById('summary-content');
  
  if (isNaN(dropoffDate) || isNaN(pickupDate) || pickupDate <= dropoffDate) {{
    summaryContent.innerHTML = '<p style="font-style: italic; color: #888;">{t['summary_placeholder']}</p>';
    return;
  }}

  // 1. Accommodation Logic
  const msPerDay = 24 * 60 * 60 * 1000;
  const totalNights = Math.ceil((pickupDate - dropoffDate) / msPerDay);
  const freeNights = Math.floor(totalNights / 10);
  const payableNights = totalNights - freeNights;
  const ratePerNight = catCount === 1 ? 20 : 35;
  const accommodationTotal = payableNights * ratePerNight;

  let breakdownHTML = `<div style="margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
    <strong>{t['breakdown_accommodation']} (${{catCount}} {t['cat_unit']}${{catCount > 1 ? '{t['cat_plural']}' : ''}}):</strong><br>
    ${{totalNights}} {t['night_unit']} x €${{ratePerNight}} = €${{totalNights * ratePerNight}}<br>
    ${{freeNights > 0 ? `<span style="color: #3DA642;">{t['breakdown_promo']}: -${{freeNights}} {t['night_unit']}</span><br>` : ''}}
    <span style="font-weight: bold;">{t['breakdown_subtotal']}: €${{accommodationTotal}}</span>
  </div>`;

  // 2. Transfer Logic
  let transferTotal = 0;
  const fixedPrices = {{ 'Schiphol': 65, 'Amsterdam': 50, 'Hoofddorp': 60, 'Lelystad': 45 }};
  
  async function computeTransfer(type) {{
    if (!document.getElementById('transfer-' + type).checked) return 0;
    const loc = document.getElementById(type + '-location-select').value;
    if (fixedPrices[loc]) return {{ cost: fixedPrices[loc], label: loc }};
    if (loc === 'Custom') {{
      const addr = document.getElementById(type + '-address').value;
      if (!addr) return 0;
      const dist = await estimateDistance(addr);
      const cost = 5 + (dist * 1.19);
      return {{ cost, dist, label: '{t['label_dist']}' }};
    }}
    return 0;
  }}

  const dropT = await computeTransfer('dropoff');
  const pickT = await computeTransfer('pickup');
  
  let transferHTML = '';
  function formatT(val, typeLabel) {{
    if (val && val.cost > 0) {{
      transferTotal += val.cost;
      const distInfo = val.dist ? ` (${{val.dist.toFixed(1)}} km)` : '';
      return `${{typeLabel}}: €${{val.cost.toFixed(2)}}${{distInfo}}<br>`;
    }}
    return '';
  }}

  const dText = formatT(dropT, '{t['label_dropoff']}');
  const pText = formatT(pickT, '{t['label_pickup']}');
  
  if (dText || pText) {{
    transferHTML = `<div style="margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
      <strong>{t['breakdown_transfer']}:</strong><br>
      ${{dText}}${{pText}}
      <span style="font-weight: bold;">{t['breakdown_subtotal']}: €${{transferTotal.toFixed(2)}}</span>
    </div>`;
  }

  // 3. Final Total
  const grandTotal = accommodationTotal + transferTotal;
  document.getElementById('estimated-total').value = grandTotal.toFixed(2);

  summaryContent.innerHTML = breakdownHTML + transferHTML + `
    <div style="font-size: 1.2rem; color: #D9A3A3; font-weight: bold;">
      {t['label_total']}: €${{grandTotal.toFixed(2)}}
    </div>
    <p style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;">* {t['total_note']}</p>`;
}}

async function estimateDistance(address) {{
  if (address.toLowerCase().includes('almere')) return 4.2;
  if (address.toLowerCase().includes('amsterdam')) return 22.5;
  if (address.toLowerCase().includes('schiphol')) return 42.0;
  return 15.0;
}}

window.onload = function() {{
  calculatePricing();
}};
"""

    script_pattern = re.compile(r'<script>.*?function toggleTransfer.*?</script>', re.DOTALL)
    html = script_pattern.sub(f'<script>{script_logic}</script>', html)
    
    with open(file_path, 'w') as f:
        f.write(html)

tr_trans = {
    'dropoff_date': 'Bırakma Tarihi',
    'dropoff_time': 'Bırakma Saati',
    'need_transfer_dropoff': 'Bırakma için Transfer Hizmeti Lazım mı?',
    'dropoff_loc': 'Bırakma Lokasyonu',
    'select_loc': 'Lokasyon Seçin',
    'loc_schiphol': 'Schiphol Havalimanı',
    'loc_amsterdam': 'Amsterdam Merkez İstasyonu',
    'loc_hoofddorp': 'Hoofddorp İstasyonu',
    'loc_lelystad': 'Lelystad İstasyonu',
    'loc_custom': 'Ev Adresi (Mesafe bazlı hesaplama)',
    'address_placeholder': 'Mesafe hesaplaması için tam adresi girin',
    'pickup_date': 'Alma Tarihi',
    'pickup_time': 'Alma Saati',
    'need_transfer_pickup': 'Alma için Transfer Hizmeti Lazım mı?',
    'pickup_loc': 'Alma Lokasyonu',
    'cat_count': 'Kedi Sayısı',
    'cat_1': '1 Kedi',
    'cat_2': '2 Kedi',
    'summary_title': 'Rezervasyon Tahmini',
    'summary_placeholder': 'Fiyat dökümünü görmek için tarih seçin...',
    'name': 'Adınız',
    'contact': 'E-posta veya Telefon',
    'notes': 'Ek Notlar (İsteğe bağlı)',
    'notes_placeholder': 'Kediniz hakkında bilmemiz gereken başka bir şey var mı?',
    'submit_btn': 'Rezervasyon Talebi Gönder',
    'breakdown_accommodation': 'Konaklama',
    'cat_unit': 'Kedi',
    'cat_plural': '',
    'night_unit': 'gece',
    'breakdown_promo': 'Kampanya',
    'breakdown_subtotal': 'Ara Toplam',
    'breakdown_transfer': 'Transfer Hizmetleri',
    'label_dist': 'Mesafe bazlı',
    'label_dropoff': 'Bırakma',
    'label_pickup': 'Alma',
    'label_total': 'Genel Toplam',
    'total_note': 'Bu bir tahmindir. Kesin fiyat onay sürecinde netleşecektir.'
}

nl_trans = {
    'dropoff_date': 'Afleverdatum',
    'dropoff_time': 'Aflevertijd',
    'need_transfer_dropoff': 'Transferservice nodig voor afleveren?',
    'dropoff_loc': 'Afleverlocatie',
    'select_loc': 'Selecteer locatie',
    'loc_schiphol': 'Luchthaven Schiphol',
    'loc_amsterdam': 'Amsterdam Centraal',
    'loc_hoofddorp': 'Station Hoofddorp',
    'loc_lelystad': 'Station Lelystad',
    'loc_custom': 'Thuisadres (Berekening op basis van afstand)',
    'address_placeholder': 'Voer het volledige adres in voor afstandsberekening',
    'pickup_date': 'Ophaaldatum',
    'pickup_time': 'Ophaaltijd',
    'need_transfer_pickup': 'Transferservice nodig voor ophalen?',
    'pickup_loc': 'Ophaallocatie',
    'cat_count': 'Aantal katten',
    'cat_1': '1 Kat',
    'cat_2': '2 Katten',
    'summary_title': 'Reserveringsschatting',
    'summary_placeholder': 'Selecteer data om de prijsopgave te zien...',
    'name': 'Uw Naam',
    'contact': 'E-mail of Telefoon',
    'notes': 'Extra opmerkingen (Optioneel)',
    'notes_placeholder': 'Is er nog iets dat we over uw kat moeten weten?',
    'submit_btn': 'Reserveringsaanvraag verzenden',
    'breakdown_accommodation': 'Accommodatie',
    'cat_unit': 'Kat',
    'cat_plural': 'ten',
    'night_unit': 'nacht(en)',
    'breakdown_promo': 'Promotie',
    'breakdown_subtotal': 'Subtotaal',
    'breakdown_transfer': 'Transferservices',
    'label_dist': 'Op basis van afstand',
    'label_dropoff': 'Afleveren',
    'label_pickup': 'Ophalen',
    'label_total': 'Eindtotaal',
    'total_note': 'Dit is een schatting. De definitieve prijs wordt bevestigd na goedkeuring.'
}

update_reservation_localized('tr', tr_trans)
update_reservation_localized('nl', nl_trans)
