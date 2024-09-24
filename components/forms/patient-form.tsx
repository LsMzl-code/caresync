"use client";
import { userFormSchema } from "@/schemas/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import CustomFormField from "../ui/custom-form-field";
import SubmitButton from "../ui/submit-button";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Actions
import { createUser } from "@/actions/patient.actions";

export enum FormFieldsType {
   INPUT = "input",
   CHECKBOX = "checkbox",
   TEXTAREA = "textarea",
   PHONE_INPUT = "phoneInput",
   DATE_PICKER = "datePicker",
   SKELETON = "skeleton",
   SELECT = "select",
}

const PatientForm = () => {
   //*** STATES ***//
   const [isLoading, setIsLoading] = useState<boolean>(false);

   //*** HOOKS ***//
   const router = useRouter()

   //*** FORM VALUES ***//
   const form = useForm<z.infer<typeof userFormSchema>>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
         name: "",
         email: "",
         phone: "",
      },
   });

   //*** FORM SUBMISSION ***//
   const onSubmit = async ({
      name,
      email,
      phone,
   }: z.infer<typeof userFormSchema>) => {
      setIsLoading(true);
      try {
         // Define user details
         const userData = { name, email, phone };
         // User creation
         const user = await createUser(userData);

         // Redirection
         if(user) router.push(`/patients/${user.$id}/inscription`)

      } catch (error) {
         console.log("error", error);
      }
      setIsLoading(false);
   };

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex-1"
         >
            {/* Header */}
            <section className="mb-12 space-y-4">
               <h1 className="header">Bonjour 👋</h1>
               <p className="text-dark-700">Prenez votre premier rendez-vous</p>
            </section>

            {/* Nom */}
            <CustomFormField
               control={form.control}
               fieldType={FormFieldsType.INPUT}
               name="name"
               label="Nom complet"
               iconSrc="/assets/icons/user.svg"
               iconAlt="utilisateur"
               placeholder="Entrez votre nom"
            />

            {/* Email */}
            <CustomFormField
               control={form.control}
               fieldType={FormFieldsType.INPUT}
               name="email"
               label="Adresse mail"
               iconSrc="/assets/icons/email.svg"
               iconAlt="Email"
               placeholder="votre@email.fr"
            />

            {/* Téléphone */}
            <CustomFormField
               control={form.control}
               fieldType={FormFieldsType.PHONE_INPUT}
               name="phone"
               label="Téléphone"
               iconSrc="/assets/icons/email.svg"
               iconAlt="Téléphone"
               placeholder="06 01 02 03 04"
            />
            <SubmitButton isLoading={isLoading}>Continuer</SubmitButton>
         </form>
      </Form>
   );
};

export default PatientForm;
