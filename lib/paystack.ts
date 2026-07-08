import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export const paystackClient = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const CREDIT_PACKAGES = {
  "1000": { credits: 1000, amount: 50000, label: "Starter" },
  "5000": { credits: 5000, amount: 225000, label: "Growth" },
  "10000": { credits: 10000, amount: 400000, label: "Scale" },
  "25000": { credits: 25000, amount: 900000, label: "Pro" },
} as const;

export type PackageId = keyof typeof CREDIT_PACKAGES;
