const SUPA = 'https://hqofhixgtarnrjkogdyq.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxb2ZoaXhndGFybnJqa29nZHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDI2NjcsImV4cCI6MjA5NjAxODY2N30.0phSRjcWXczHFaFUg2uYJADZWOYJDUWIdgFJ0BKCHJA';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-file-name, x-file-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const fileName = event.headers['x-file-name'] || `foto_${Date.now()}.jpg`;
    const fileType = event.headers['x-file-type'] || 'image/jpeg';
    const path = fileName;

    const body = Buffer.from(event.body, 'base64');

    const response = await fetch(`${SUPA}/storage/v1/object/fotos/${path}`, {
      method: 'POST',
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': fileType
      },
      body
    });

    const text = await response.text();
    if (!response.ok) {
      return { statusCode: response.status, headers, body: text };
    }

    const publicUrl = `${SUPA}/storage/v1/object/public/fotos/${path}`;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: publicUrl })
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
