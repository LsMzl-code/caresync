import { z } from "zod";

export const userFormSchema = z.object({
   name: z
      .string()
      .min(2, {
         message: "Votre nom ne peut pas faire moins de 2 caractères",
      })
      .max(100, {
         message: "Votre nom ne peut pas dépasser 100 caractères",
      }),
   email: z.string().email("Adresse mail non valide"),
   phone: z.string().refine((phone) => /^\+?\d{10,15}$/.test(phone), {
      message: "Numéro de téléphone non valide",
   }),
});

export const patientFormSchema = z.object({
   name: z
      .string()
      .min(2, "Votre nom ne peut pas faire moins de 2 caractères")
      .max(100, "Votre nom ne peut pas dépasser 100 caractères"),
   email: z.string().email("Adresse mail non valide"),
   phone: z
      .string()
      .refine(
         (phone) => /^\+\d{10,15}$/.test(phone),
         "Numéro de téléphone non valide"
      ),
   birthDate: z.coerce.date(),
   gender: z.enum(["homme", "femme", "autre"]),
   address: z
      .string()
      .min(5, "Votre adresse ne peut pas faire moins de 5 caractères")
      .max(500, "Votre adresse ne peut pas dépasser 500 caractères"),
   occupation: z
      .string()
      .min(2, "Votre profession ne peut pas faire moins de 2 caractères")
      .max(500, "Votre profession ne peut pas dépasser 500 caractères"),
   emergencyContactName: z
      .string()
      .min(2, "Le nom de votre contact ne peut pas faire moins de 2 caractères")
      .max(50, "Le nom de votre contact ne peut pas dépasser 500 caractères"),
   emergencyContactNumber: z
      .string()
      .refine(
         (emergencyContactNumber) =>
            /^\+\d{10,15}$/.test(emergencyContactNumber),
         "Numéro de téléphone non valide"
      ),
   primaryPhysician: z.string().min(2, "Vous devez séléctionner un médecin"),
   insuranceProvider: z
      .string()
      .min(
         2,
         "Le nom de votre assurance ne peut pas faire moins de 2 caractères"
      )
      .max(50, "Le nom de votre assurance ne peut pas dépasser 50 caractères"),
   insurancePolicyNumber: z
      .string()
      .min(2, "Policy number must be at least 2 characters")
      .max(50, "Policy number must be at most 50 characters"),
   allergies: z.string().optional(),
   currentMedication: z.string().optional(),
   familyMedicalHistory: z.string().optional(),
   pastMedicalHistory: z.string().optional(),
   identificationType: z.string().optional(),
   identificationNumber: z.string().optional(),
   identificationDocument: z.custom<File[]>().optional(),
   treatmentConsent: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
         message: "Vous devez confirmer votre accord",
      }),
   disclosureConsent: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
         message: "Vous devez confirmer votre accord",
      }),
   privacyConsent: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
         message: "Vous devez confirmer votre accord",
      }),
});

export const CreateAppointmentFormSchema = z.object({
   primaryPhysician: z.string().min(2, "Select at least one doctor"),
   schedule: z.coerce.date(),
   reason: z
      .string()
      .min(2, "Reason must be at least 2 characters")
      .max(500, "Reason must be at most 500 characters"),
   note: z.string().optional(),
   cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentFormSchema = z.object({
   primaryPhysician: z.string().min(2, "Select at least one doctor"),
   schedule: z.coerce.date(),
   reason: z.string().optional(),
   note: z.string().optional(),
   cancellationReason: z.string().optional(),
});

export const CancelAppointmentFormSchema = z.object({
   primaryPhysician: z.string().min(2, "Select at least one doctor"),
   schedule: z.coerce.date(),
   reason: z.string().optional(),
   note: z.string().optional(),
   cancellationReason: z
      .string()
      .min(2, "Reason must be at least 2 characters")
      .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
   switch (type) {
      case "create":
         return CreateAppointmentFormSchema;
      case "cancel":
         return CancelAppointmentFormSchema;
      default:
         return ScheduleAppointmentFormSchema;
   }
}
