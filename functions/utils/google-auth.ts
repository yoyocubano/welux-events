
function pemToBinary(pem: string): ArrayBuffer {
    const base64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\s/g, ''); // Remove newlines and spaces

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

async function sign(content: string, privateKey: string): Promise<string> {
    const binaryKey = pemToBinary(privateKey);

    // Import the private key
    const key = await crypto.subtle.importKey(
        'pkcs8',
        binaryKey,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
        false,
        ['sign']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(content);

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        key,
        data
    );

    // Convert signature to base64url
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function base64url(source: object | string): string {
    let json = typeof source === 'string' ? source : JSON.stringify(source);
    return btoa(json)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getGoogleAuthToken(email: string, privateKey: string, scopes: string[]): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const oneHour = 3600;

    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };

    const claimSet = {
        iss: email,
        scope: scopes.join(' '),
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + oneHour,
        iat: now
    };

    const encodedHeader = base64url(header);
    const encodedClaimSet = base64url(claimSet);
    const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

    const signature = await sign(unsignedToken, privateKey);
    const jwt = `${unsignedToken}.${signature}`;

    // Exchange JWT for Access Token
    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    params.append('assertion', jwt);

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Auth Error: ${response.status} ${text}`);
    }

    const data: any = await response.json();
    return data.access_token;
}
