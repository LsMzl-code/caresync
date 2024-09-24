"use client";
import {
   CreateAppointmentFormSchema,
   getAppointmentSchema,
} from "@/schemas/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import CustomFormField from "../ui/custom-form-field";
import SubmitButton from "../ui/submit-button";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Actions
import { doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
   createAppointment,
   updateAppointment,
} from "@/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

export enum FormFieldsType {
   INPUT = "input",
   CHECKBOX = "checkbox",
   TEXTAREA = "textarea",
   PHONE_INPUT = "phoneInput",
   DATE_PICKER = "datePicker",
   SKELETON = "skeleton",
   SELECT = "select",
}

const AppointmentForm = ({
   type,
   userId,
   patientId,
   appointment,
   setOpen,
}: {
   userId: string;
   patientId: string;
   type: "create" | "cancel" | "schedule";
   appointment?: Appointment;
   setOpen: (open: boolean) => void;
}) => {
   //*** STATES ***//
   const [isLoading, setIsLoading] = useState<boolean>(false);

   //*** HOOKS ***//
   const router = useRouter();

   const AppointmentFormValidation = getAppointmentSchema(type);

   //*** FORM VALUES ***//
   const form = useForm<z.infer<typeof CreateAppointmentFormSchema>>({
      resolver: zodResolver(CreateAppointmentFormSchema),
      defaultValues: {
         primaryPhysician: appointment ? appointment.primaryPhysician : "",
         schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
         reason: appointment?.reason || "",
         note: appointment?.note || "",
         cancellationReason: appointment?.cancellationReason || "",
      },
   });

   //*** FORM SUBMISSION ***//
   const onSubmit = async (
      values: z.infer<typeof CreateAppointmentFormSchema>
   ) => {
      setIsLoading(true);

      // Check the status of the reservation request
      let status;
      switch (type) {
         case "schedule":
            status = "scheduled";
            break;
         case "cancel":
            status = "cancelled";
            break;
         default:
            status = "pending";
            break;
      }
      try {
         // Define reservation data
         if (type === "create" && patientId) {
            const appointmentData = {
               userId,
               patient: patientId,
               primaryPhysician: values.primaryPhysician,
               schedule: new Date(values.schedule),
               reason: values.reason,
               note: values.note,
               status: status as Status,
            };
            const appointment = await createAppointment(appointmentData);

            if (appointment) {
               form.reset();
               router.push(
                  `/patients/${userId}/rendez-vous/succes?appointmentId=${appointment.$id}`
               );
            }
         } else {
            const appointmentToUpdate = {
               userId,
               appointmentId: appointment?.$id!,
               appointment: {
                  primaryPhysician: values?.primaryPhysician,
                  schedule: new Date(values.schedule),
                  status: status as Status,
                  cancellationReason: values.cancellationReason,
               },
               type,
            };

            const updatedAppointment = await updateAppointment(
               appointmentToUpdate
            );

            if (updatedAppointment) {
               setOpen && setOpen(false);
               form.reset();
            }
         }
      } catch (error) {
         console.log("error", error);
      }
      setIsLoading(false);
   };

   let buttonLabel;
   switch (type) {
      case "cancel":
         buttonLabel = "Annuler le rendez-vous";
         break;
      case "create":
         buttonLabel = "Confirmer le rendez-vous";
         break;
      case "schedule":
         buttonLabel = "Valider le rendez-vous";
         break;
      default:
         break;
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex-1"
         >
            {/* Header */}
            {type === "create" && (
               <section className="mb-12 space-y-4">
                  <h1 className="header">Nouveau rendez-vous</h1>
                  <p className="text-dark-700">
                     Prenez rendez-vous en 30 secondes
                  </p>
               </section>
            )}

            {type !== "cancel" && (
               <>
                  {/* Doctor */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.SELECT}
                     name="primaryPhysician"
                     label="Choix du médecin"
                     placeholder="Sélectionnez un médecin"
                  >
                     {doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                           <div className="flex cursor-pointer items-center gap-2">
                              <Image
                                 src={doctor.image}
                                 alt={doctor.name}
                                 width={32}
                                 height={32}
                                 className="rounded-full object-cover object-center border border-dark-500"
                              />
                              <p>{doctor.name}</p>
                           </div>
                        </SelectItem>
                     ))}
                  </CustomFormField>

                  {/* Date */}
                  <CustomFormField
                     fieldType={FormFieldsType.DATE_PICKER}
                     control={form.control}
                     name="schedule"
                     label="Date souhaitée"
                     showTimeSelect
                     dateFormat="dd/MM/yyyy - HH:mm"
                  />
                  {/* Motif & Notes */}
                  <div className="flex flex-col gap-6 xl:flex-row">
                     <CustomFormField
                        fieldType={FormFieldsType.TEXTAREA}
                        control={form.control}
                        name="reason"
                        label="Motif de la consultation"
                        placeholder="Symptômes..."
                     />
                     <CustomFormField
                        fieldType={FormFieldsType.TEXTAREA}
                        control={form.control}
                        name="note"
                        label="Informations complémentaires (optionnel)"
                        placeholder="Toutes autres informations dont le medecin pourrait avoir besoin"
                     />
                  </div>
               </>
            )}

            {/* Cancel */}
            {type === "cancel" && (
               <CustomFormField
                  fieldType={FormFieldsType.TEXTAREA}
                  control={form.control}
                  name="cancellationReason"
                  label="Motif de l'annulation"
                  placeholder="Détaillez les raisons de l'annulation du rendez-vous"
               />
            )}

            <SubmitButton
               isLoading={isLoading}
               className={`${
                  type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
               } w-full`}
            >
               {buttonLabel}
            </SubmitButton>
         </form>
      </Form>
   );
};

export default AppointmentForm;
