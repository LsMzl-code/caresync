"use server";

import {
   BUCKET_ID,
   DATABASE_ID,
   databases,
   ENDPOINT,
   PATIENT_COLLECTION_ID,
   PROJECT_ID,
   storage,
   users,
} from "@/lib/appwrite.config";
import { parseStringify } from "@/lib/utils";
import { Query, ID } from "node-appwrite";

import { InputFile } from "node-appwrite/file";

/**
 * Création d'un nouvel utilisateur dans la base de données.
 * -
 * @param user
 */
export const createUser = async (user: CreateUserParams) => {
   try {
      const newUser = await users.create(
         ID.unique(),
         user.email,
         user.phone,
         undefined,
         user.name
      );
      return parseStringify(newUser);
   } catch (error: any) {
      if (error && error?.code == 409) {
         const documents = await users.list([
            Query.equal("email", [user.email]),
         ]);

         return documents?.users[0];
      }
   }
};

/**
 * Récupération des informations d'un utilisateur
 * -
 * @param userId
 * @returns
 */
export const getUser = async (userId: string) => {
   try {
      const user = await users.get(userId);
      return parseStringify(user);
   } catch (error) {
      console.log({ error });
   }
};

/**
 * Création d'un nouveau patient dans la base de données
 * -
 * @param userId
 * @returns
 */
export const registerPatient = async ({
   identificationDocument,
   ...patient
}: RegisterUserParams) => {
   try {
      // Récupération du document uploadé sous forme de blob
      let file;

      if (identificationDocument) {
         const inputFile = InputFile.fromBuffer(
            identificationDocument?.get("blobFile") as Blob,
            identificationDocument?.get("fileName") as string
         );
         // Sauvegarde du document dans la base de données
         file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
      }

      // Création du patient dans la base de données
      const newPatient = await databases.createDocument(
         DATABASE_ID!,
         PATIENT_COLLECTION_ID!,
         ID.unique(),
         {
            // Id dans la base de données du document stocké
            identificationDocumentId: file?.$id || null,
            // Chemin d'accès au document stocké
            identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
            ...patient,
         }
      );

      return parseStringify(newPatient);
   } catch (error) {
      console.log({ error });
   }
};

/**
 * Récupération des informations d'un patient 
 * -
 * @param userId ID du patient
 * @returns
 */
export const getPatient = async (userId: string) => {
   try {
      const patients = await databases.listDocuments(
         DATABASE_ID!,
         PATIENT_COLLECTION_ID!,
         [Query.equal("userId", userId)]
      )
      return parseStringify(patients.documents[0]);
   } catch (error) {
      console.log({ error });
   }
};