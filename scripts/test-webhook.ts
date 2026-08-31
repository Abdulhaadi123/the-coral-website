import 'dotenv/config';

async function testWebhook() {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  console.log('Testing Google Sheet Webhook URL:', url);

  if (!url) {
    console.error('No GOOGLE_SHEET_WEBHOOK_URL found in .env');
    return;
  }

  const payload = {
    id: 'lead-test-' + Date.now(),
    name: 'Hamza Khan',
    email: 'hamza.khan@coralroom.com',
    phone: '+92 300 9876543',
    source: 'portfolio_gate',
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const text = await res.text();
    console.log('Status Code:', res.status);
    console.log('Response:', text);

    if (res.ok) {
      console.log('\n🎉 SUCCESS! Row appended to Google Sheet!');
    }
  } catch (err: any) {
    console.error('Error sending test webhook:', err.message || err);
  }
}

testWebhook();
