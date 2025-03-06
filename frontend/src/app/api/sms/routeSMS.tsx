import type { NextApiRequest, NextApiResponse } from 'next';
import { sendOTP } from './sms';

export default async function SendCode(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "Le numéro de téléphone et le code sont requis"});
  }

  try {
    const result = await sendOTP(phone, code);
    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
}

