"use server";

import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';

const apiKey = process.env.VONAGE_API_KEY || '';
const apiSecret = process.env.VONAGE_API_SECRET || '';
const from = process.env.VONAGE_SMS_FROM || 'SenParrainage';

const auth = new Auth({
  apiKey: apiKey,
  apiSecret: apiSecret
});

const vonage = new Vonage(auth);

export async function sendOTP(phoneNumber: string, otp: string) {
  // Ajout du préfixe +221 si le numéro n'a pas de code pays
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+221' + phoneNumber; 
  }
  
  const text = `SenParrainage : Votre code de vérification est ${otp}. Ne partagez ce code avec personne.`;

  try {
    const response = await vonage.sms.send({ to: phoneNumber, from, text });
    console.log('Message envoyé avec succès', response);
    return { success: true };
  } catch (error) {
    console.error("Erreur d'envoi de SMS :", error);
    return { success: false, error };
  }
}

