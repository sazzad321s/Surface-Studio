import { betterAuth} from "better-auth";
import {jwt} from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("surface-studio");

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT as string, 
            clientSecret: process.env.GOOGLE_SECRET as string, 
        }, 
    },
  database: mongodbAdapter(db, {
    client,
  }),
   plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 1 * 24 * 60 * 60
    }
  }
});