import * as admin from "firebase-admin";
import { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { serviceAccount } from "../../../serviceAccount";


export const adminApp =
  admin.apps.length === 0
    ? admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
      })
    : admin.apps[0];

export const adminAuth = getAuth(adminApp as App);
