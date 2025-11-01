import dotenv from 'dotenv';
dotenv.config();

// export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI;

export const JWT_SECRET=process.env.JWT_SECRET
 
export const SMTP_EMAIL= process.env.SMTP_EMAIL
export const SMTP_PASSWORD=process.env.SMTP_PASSWORD