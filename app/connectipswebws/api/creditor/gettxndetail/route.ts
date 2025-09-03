// app/api/connectips/validateTxn/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import pem from "pem";
import NodeRSA from "node-rsa";

const MERCHANTID = process.env.CONNECTIPS_MERCHANTID!;
const APPID = process.env.CONNECTIPS_APPID!;
const PASSWORD = process.env.CONNECTIPS_PASSWORD!;
const BASE_URL = process.env.CONNECTIPS_API_BASE!;
const PFX_PASS = process.env.CONNECTIPS_CREDITOR_PASSWORD!;
const PFX_PATH = path.join(process.cwd(), "signatures", "CREDITOR.pfx");

const pfx = fs.readFileSync(PFX_PATH);

function getPrivateKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    pem.readPkcs12(pfx, { p12Password: PFX_PASS }, (err, cert) => {
      if (err) return reject(err);
      if (!cert || !cert.key) return reject("Private key not found");
      resolve(cert.key);
    });
  });
}

export async function POST(req: Request) {
  try {
    const { referenceId, txnAmt } = await req.json();

    // Build token string
    const message = `MERCHANTID=${MERCHANTID},APPID=${APPID},REFERENCEID=${referenceId},TXNAMT=${txnAmt}`;

    const key = await getPrivateKey();
    const sign = crypto.createSign("SHA256");
    sign.update(message);
    sign.end();

    const token = sign.sign(key, "base64");

    // Call ConnectIPS validate API
    const response = await fetch(`${BASE_URL}/validatetxn`, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${APPID}:${PASSWORD}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantId: Number(MERCHANTID),
        appId: APPID,
        referenceId,
        txnAmt,
        token,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
