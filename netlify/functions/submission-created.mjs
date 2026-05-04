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

    // Minimal payload based on confirmed existing columns
    const payload = {
      customer_name: payloadData['name'] || payloadData['customer_name'] || '',
      customer_contact: payloadData['phone'] || payloadData['customer_contact'] || '',
      dropoff_date: payloadData['dropoff-date'] || payloadData['dropoff_date'] || null,
      pickup_date: payloadData['pickup-date'] || payloadData['pickup_date'] || null
    };

    console.log("Final Supabase insert keys:", Object.keys(payload));

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
