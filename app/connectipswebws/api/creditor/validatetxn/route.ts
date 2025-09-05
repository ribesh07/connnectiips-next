import { NextResponse } from 'next/server';

// import { hostname } from '#/utils/constants';
//Unauthorized Error need to fix

const hostnameEnv = process.env.NEXT_PUBLIC_HOSTNAME;
const hostname = hostnameEnv ? hostnameEnv : 'http://localhost:3000';
// const USERID = process.env.CONNECTIPS_MERCHAND_USER_ID;
const USERID = process.env.NEXT_PUBLIC_CONNECTIPS_APPID;
const PASSWORD = process.env.CONNECTIPS_AUTH_PASSWORD;
const VALADIATION_URL = process.env.CONNECTIPS_VALIDATION_API_URL;
const MERCHANTID = process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID;
const APPID = process.env.NEXT_PUBLIC_CONNECTIPS_APPID;



const credentials = Buffer.from(`${APPID}:${PASSWORD}`).toString("base64");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request Body:', body);

    const tokenResponse = await fetch(`${hostname}/connectips/get_token`, {
      method: 'POST',
      body: JSON.stringify(body),
      cache: 'no-cache',
    });

    if (!tokenResponse.ok) {
      throw new Error('Token Error');
    }

    const { TOKEN } = await tokenResponse.json();

    const payload = {
        merchantId: Number(MERCHANTID),          
        appId: APPID,                           
        referenceId: String(body.REFERENCEID),   
        txnAmt: Number(body.TXNAMT),            
        token: TOKEN,
      };

    console.log('Payload:', payload);
    console.log('Validation URL:', VALADIATION_URL);

    const response = await fetch(VALADIATION_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Validate Error');
    }
    const data = await response.json();
    console.log('Validation Response:', data);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 'ERROR',
      statusDesc: 'Internal Error',
    });
  }
}
