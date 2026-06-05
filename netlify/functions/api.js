const SUPA = 'https://hqofhixgtarnrjkogdyq.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxb2ZoaXhndGFybnJqa29nZHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDI2NjcsImV4cCI6MjA5NjAxODY2N30.0phSRjcWXczHFaFUg2uYJADZWOYJDUWIdgFJ0BKCHJA';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const params = event.queryStringParameters || {};
    const table = params.table;
    const method = event.httpMethod;
    const filter = params.filter || '';
    const order = params.order || '';

    if (!table) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'table required' }) };
    }

    let url = `${SUPA}/rest/v1/${table}?select=*`;
    if (filter) url += `&${filter}`;
    if (order) url += `&order=${order}`;

    const fetchHeaders = {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    // For DELETE/PATCH add filter
    let supaUrl = url;
    if (method === 'DELETE' || method === 'PATCH') {
      supaUrl = `${SUPA}/rest/v1/${table}`;
      if (filter) supaUrl += `?${filter}`;
    }
    if (method === 'POST') {
      supaUrl = `${SUPA}/rest/v1/${table}`;
    }

    const response = await fetch(supaUrl, {
      method,
      headers: fetchHeaders,
      body: method !== 'GET' && method !== 'DELETE' ? event.body : undefined
    });

    const text = await response.text();
    return {
      statusCode: response.status,
      headers,
      body: text
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message })
    };
  }
};
