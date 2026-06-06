#!/usr/bin/env node
/**
 * Deploy Firestore rules and indexes via Google Cloud REST APIs.
 * Uses service account credentials — no interactive login required.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const serviceAccount = require('../secrets/automation-copilot-62b12-key.json');
const projectId = serviceAccount.project_id;

// Read config files
const rulesContent = fs.readFileSync(path.join(__dirname, '..', 'firebase', 'firestore.rules.prod'), 'utf8');
const indexesContent = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'firestore.indexes.json'), 'utf8'));

function httpsRequest(url, options, postData) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function getAccessToken() {
  const crypto = require('crypto');
  const now = Math.floor(Date.now() / 1000);

  // Create JWT header and payload
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  // Base64url encode
  const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const signingInput = b64url(header) + '.' + b64url(payload);

  // Sign with RSA-SHA256
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(serviceAccount.private_key, 'base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const jwt = signingInput + '.' + signature;

  // Exchange for access token
  const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const result = await httpsRequest('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) },
  }, postData);

  if (result.data.access_token) {
    return result.data.access_token;
  }
  throw new Error(`Token exchange failed: ${JSON.stringify(result.data)}`);
}

async function deployRules(accessToken) {
  console.log('2. Deploying Firestore security rules...');

  // First, create the release if it doesn't exist
  const putBody = JSON.stringify({
    source: {
      files: [{ name: 'firestore.rules', content: rulesContent }]
    }
  });

  const result = await httpsRequest(
    `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud-firestore`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(putBody),
      },
    },
    putBody
  );

  if (result.status >= 200 && result.status < 300) {
    console.log('   ✅ Rules deployed successfully!');
    if (result.data && result.data.name) {
      console.log('   Release:', result.data.name);
    }
    return true;
  } else {
    console.log(`   ❌ Rules deploy failed (${result.status})`);
    console.log('   Response:', JSON.stringify(result.data).substring(0, 300));
    return false;
  }
}

async function deployIndexes(accessToken) {
  console.log('3. Deploying Firestore indexes...');

  // Use the Firebase Management API for index deployment
  const indexesBody = JSON.stringify({
    index: indexesContent
  });

  const result = await httpsRequest(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/collectionGroups/*:createIndexes`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(indexesBody),
      },
    },
    indexesBody
  );

  if (result.status >= 200 && result.status < 300) {
    console.log('   ✅ Indexes submitted successfully!');
    if (result.data && result.data.name) {
      console.log('   Operation:', result.data.name);
    }
    return true;
  } else {
    console.log(`   ⚠️  Index deployment returned status ${result.status}`);
    console.log('   Response:', JSON.stringify(result.data).substring(0, 300));
    return false;
  }
}

async function main() {
  console.log('🔥 Deploying Firestore configuration to:', projectId);
  console.log('');

  // 1. Get access token
  console.log('1. Generating service account access token...');
  const accessToken = await getAccessToken();
  console.log('   ✅ Access token generated successfully');
  console.log('');

  // 2. Deploy rules
  const rulesOk = await deployRules(accessToken);
  console.log('');

  // 3. Deploy indexes
  const indexesOk = await deployIndexes(accessToken);
  console.log('');

  console.log('═══════════════════════════════════════════════════════════');
  if (rulesOk && indexesOk) {
    console.log('🎉 All Firestore configuration deployed successfully!');
  } else if (rulesOk) {
    console.log('✅ Rules deployed! Indexes may need manual creation via Firebase Console.');
  } else {
    console.log('⚠️  Some deployments need attention. Check Firebase Console.');
  }
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});