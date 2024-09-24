"use server";

import {
   APPOINTMENT_COLLECTION_ID,
   DATABASE_ID,
   databases,
   messaging,
} from "@/lib/appwrite.config";
import { formatDateTime, parseStringify } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

export const createAppointment = async (
   appointment: CreateAppointmentParams
) => {
   try {
      const newAppointment = await databases.createDocument(
         DATABASE_ID!,
         APPOINTMENT_COLLECTION_ID!,
         ID.unique(),
         {
            ...appointment,
         }
      );
      return parseStringify(newAppointment);
   } catch (error) {}
};

/**
 * Récupération des informations d'un rendez-vous
 * -
 * @param userId id du rendez-vous
 * @returns
 */
export const getAppointment = async (appointmentId: string) => {
   try {
      const appointment = await databases.getDocument(
         DATABASE_ID!,
         APPOINTMENT_COLLECTION_ID!,
         appointmentId
      );
      return parseStringify(appointment);
   } catch (error) {
      console.log({ error });
   }
};

/**
 * Récupération des informations des derniers rendez-vous
 * -
 * @param userId id du rendez-vous
 * @returns
 */
export const getRecentAppointmentList = async () => {
   try {
      const appointments = await databases.listDocuments(
         DATABASE_ID!,
         APPOINTMENT_COLLECTION_ID!,
         [Query.orderDesc("$createdAt")]
      );

      const initialCounts = {
         scheduledCount: 0,
         pendingCount: 0,
         cancelledCount: 0,
      };

      const counts = (appointments.documents as Appointment[]).reduce(
         (acc, appointment) => {
            if (appointment.status === "scheduled") {
               acc.scheduledCount++;
            } else if (appointment.status === "pending") {
               acc.pendingCount++;
            } else if (appointment.status === "cancelled") {
               acc.cancelledCount++;
            }

            return acc;
         },
         initialCounts
      );

      const data = {
         totalCount: appointments.total,
         ...counts,
         documents: appointments.documents,
      };
      revalidatePath("/admin");
      return parseStringify(data);
   } catch (error) {
      console.log({ error });
   }
};

export const updateAppointment = async ({
   appointmentId,
   appointment,
   type,
   userId,
}: UpdateAppointmentParams) => {
   try {
      const updatedAppointment = await databases.updateDocument(
         DATABASE_ID!,
         APPOINTMENT_COLLECTION_ID!,
         appointmentId,
         appointment
      );

      if (!updatedAppointment) throw new Error("Rendez-vous non trouvé");

      //SMS notification
      const smsMessage = `CareSync, \n 
      ${
         type === " schedule"
            ? `Votre rendez-vous à été confirmé pour le ${
                 formatDateTime(appointment.schedule!).dateTime
              } avec le docteur ${appointment.primaryPhysician}`
            : `Votre rendez-vous a été annulé pour le motif suivant: \n "${appointment.cancellationReason}"`
      }`;

      await sendSmsNotification(userId, smsMessage);

      revalidatePath(`/admin`);
      return parseStringify(updatedAppointment);
   } catch (error) {
      console.log({ error });
   }
};

/**
 *
 * @param userId
 * @param content
 * @returns
 */
export const sendSmsNotification = async (userId: string, content: string) => {
   try {
      const message = await messaging.createSms(
         ID.unique(),
         content,
         [],
         [userId]
      );
      return parseStringify(message);
   } catch (error) {
      console.log("error", error);
   }
};
