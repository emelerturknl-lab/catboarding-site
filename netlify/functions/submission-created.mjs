// netlify/functions/submission-created.mjs

export const handler = async (event, context) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hrlvsrvkaoepblodsdmt.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('--- Function started: submission-created ---');

    if (!SUPABASE_SERVICE_KEY) {
      console.error('Error: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration' }) };
    }

    // Parse the Netlify event body
    const body = JSON.parse(event.body || '{}');
    console.log('Form name received:', body.payload ? body.payload.form_name : 'unknown');
    
    const payloadData = body.payload ? body.payload.data : null;

    if (!payloadData) {
      console.error('Error: No form payload data found in request');
      return { statusCode: 400, body: JSON.stringify({ error: 'No form payload data' }) };
    }

    console.log('Payload keys received:', Object.keys(payloadData));

    // Full payload with fallbacks to avoid 23502 (null value) errors
    const payload = {
      customer_name: payloadData.name || payloadData.customer_name || 'Unknown customer',
      customer_contact: payloadData.phone || payloadData.customer_contact || 'No phone',
      dropoff_date: payloadData['dropoff-date'] || payloadData.dropoff_date || new Date().toISOString().slice(0, 10),
      pickup_date: payloadData['pickup-date'] || payloadData.pickup_date || payloadData['dropoff-date'] || new Date().toISOString().slice(0, 10),
      dropoff_time: payloadData['dropoff-time'] || payloadData.dropoff_time || '12:00:00',
      pickup_time: payloadData['pickup-time'] || payloadData.pickup_time || '12:00:00',
      transfer_dropoff: payloadData['transfer-dropoff'] === 'on' || payloadData.transfer_dropoff === true || false,
      transfer_pickup: payloadData['transfer-pickup'] === 'on' || payloadData.transfer_pickup === true || false,
      dropoff_location: payloadData['dropoff-location'] || payloadData.dropoff_location || '',
      pickup_location: payloadData['pickup-location'] || payloadData.pickup_location || '',
      cat_count: Number(payloadData['cat-count'] || payloadData.cat_count || 1),
      total_price: Number(payloadData['estimated-total'] || payloadData.total_price || 0),
      message: payloadData.message || payloadData['additional-notes'] || '',
      language: payloadData.language || 'EN',
      status: payloadData.status || 'pending'
    };

    console.log("Final Supabase insert keys:", Object.keys(payload));

    // Use native fetch to insert into Supabase using Service Role Key
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
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
