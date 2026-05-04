// netlify/functions/submission-created.mjs

export const handler = async (event, context) => {
  try {
    const SUPABASE_URL = 'https://hrlvsrvkaoepblodsdmt.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_pvGGrrnT0-B9VPTsx3j97Q_5IDViROP';

    console.log('--- Function started: submission-created ---');

    // Parse the Netlify event body
    const body = JSON.parse(event.body || '{}');
    console.log('Form name received:', body.payload ? body.payload.form_name : 'unknown');
    
    const payloadData = body.payload ? body.payload.data : null;

    if (!payloadData) {
      console.error('Error: No form payload data found in request');
      return { statusCode: 400, body: JSON.stringify({ error: 'No form payload data' }) };
    }

    console.log('Payload keys received:', Object.keys(payloadData));

    // Construct Locations
    let dropLoc = null;
    if (payloadData['transfer-dropoff'] === 'on' || payloadData['transfer-dropoff'] === true) {
      dropLoc = payloadData['dropoff-location-select'] === 'Custom'
        ? `${payloadData['dropoff-street'] || ''} ${payloadData['dropoff-houseno'] || ''}, ${payloadData['dropoff-postcode'] || ''} ${payloadData['dropoff-city'] || ''}`
        : payloadData['dropoff-location-select'];
    }

    let pickLoc = null;
    if (payloadData['transfer-pickup'] === 'on' || payloadData['transfer-pickup'] === true) {
      pickLoc = payloadData['pickup-location-select'] === 'Custom'
        ? `${payloadData['pickup-street'] || ''} ${payloadData['pickup-houseno'] || ''}, ${payloadData['pickup-postcode'] || ''} ${payloadData['pickup-city'] || ''}`
        : payloadData['pickup-location-select'];
    }

    const phone = payloadData['phone'] || null;
    const email = payloadData['email'] || null;
    const userMessage = payloadData['message'] || "";
    const fullMessage = email ? `Email: ${email}\n---\n${userMessage}` : userMessage;

    // Cat items logic
    let catItems = [];
    if (payloadData['cat-item']) {
      catItems = Array.isArray(payloadData['cat-item']) ? payloadData['cat-item'] : [payloadData['cat-item']];
    }
    const otherItem = payloadData['cat-item-other'];
    const itemsText = catItems.join(', ') + (otherItem ? ` (Other: ${otherItem})` : '');

    // Special needs logic
    let specialNeeds = [];
    if (payloadData['special-need']) {
      specialNeeds = Array.isArray(payloadData['special-need']) ? payloadData['special-need'] : [payloadData['special-need']];
    }
    const needsText = specialNeeds.join(', ') + (payloadData['special-need-details'] ? `\nDetails: ${payloadData['special-need-details']}` : '');

    const totalPrice = parseFloat(payloadData['estimated-total']) || 0;

    const payload = {
      customer_name: payloadData['name'] || 'Unknown',
      customer_contact: phone,
      dropoff_date: payloadData['dropoff-date'],
      dropoff_time: payloadData['dropoff-time'],
      pickup_date: payloadData['pickup-date'],
      pickup_time: payloadData['pickup-time'],
      transfer_dropoff: payloadData['transfer-dropoff'] === 'on' || payloadData['transfer-dropoff'] === true,
      dropoff_location: dropLoc,
      transfer_pickup: payloadData['transfer-pickup'] === 'on' || payloadData['transfer-pickup'] === true,
      pickup_location: pickLoc,
      cat_count: parseInt(payloadData['cat-count']) || 1,
      total_price: totalPrice,
      message: fullMessage,
      language: 'EN',
      cat_items: itemsText,
      special_needs: needsText,
      additional_notes: payloadData['additional-notes'] || '',
      whatsapp_status: 'none',
      reservation_type: payloadData['reservation_type'] || 'normal_booking'
    };

    // Use native fetch to insert into Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase insert ERROR:', errorText);
    } else {
      console.log('Supabase insert SUCCESS. Record added to "reservations" table.');
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: 'success' })
    };

  } catch (err) {
    console.error('Error in submission-created function:', err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
