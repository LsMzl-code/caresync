"use client";
import { patientFormSchema } from "@/schemas/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";

import CustomFormField from "../ui/custom-form-field";
import SubmitButton from "../ui/submit-button";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Actions
import { registerPatient } from "@/actions/patient.actions";
import { FormFieldsType } from "./patient-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

// UI Components
import {
   doctors,
   genderOptions,
   IdentificationTypes,
   PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { FileUploader } from "../file-uploader";
import { emit } from "process";

const RegisterForm = ({ user }: { user: User }) => {
   //*** STATES ***//
   const [isLoading, setIsLoading] = useState<boolean>(false);

   //*** HOOKS ***//
   const router = useRouter();

   //*** FORM VALUES ***//
   const form = useForm<z.infer<typeof patientFormSchema>>({
      resolver: zodResolver(patientFormSchema),
      defaultValues: {
         ...PatientFormDefaultValues,
         name: user.name,
         email: user.email,
         phone: user.phone,
      },
   });


   //*** FORM SUBMISSION ***//
   const onSubmit = async (values: z.infer<typeof patientFormSchema>) => {
      setIsLoading(true);

      let formData;

      // Check if a file is uploaded
      if (
         values.identificationDocument &&
         values.identificationDocument?.length > 0
      ) {
         // Convert the file to a blob
         const blobFile = new Blob([values.identificationDocument[0]], {
            type: values.identificationDocument[0].type,
         });

         formData = new FormData();
         formData.append("blobFile", blobFile);
         formData.append("fileName", values.identificationDocument[0].name);
      }
      try {
         // Define the patients informations
         const patient = {
            ...values,
            userId: user.$id,
            birthDate: new Date(values.birthDate),
            identificationDocument: formData,
         };

         // Patient creation
         //@ts-ignore
         const newPatient = await registerPatient(patient);

         // Redirection
         if (newPatient) router.push(`/patients/${user.$id}/rendez-vous`);
      } catch (error) {
         console.log("error", error);
      }
      setIsLoading(false);
   };

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex-1"
         >
            {/* Header */}
            <section className="space-y-4">
               <h1 className="header">Bienvenue 👋</h1>
               <p className="text-dark-700">Parlez-nous un peu de vous.</p>
            </section>

            {/* Personnal Informations */}
            <section className="space-y-6">
               <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Informations personnelles</h2>
               </div>
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

               {/* Email & phone */}
               <div className="flex flex-col gap-5 xl:flex-row">
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
               </div>

               {/* Birth & Gender */}
               <div className="flex flex-col gap-5 xl:flex-row">
                  {/* Birth */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.DATE_PICKER}
                     name="birthDate"
                     label="Date de naissance"
                     iconSrc="/assets/icons/email.svg"
                     iconAlt="Email"
                     placeholder="votre@email.fr"
                  />
                  {/* Gender */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.SKELETON}
                     name="gender"
                     label="Genre"
                     renderSkeleton={(field) => (
                        <FormControl>
                           <RadioGroup
                              className="flex h-11 gap-6 xl:justify-between"
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              {genderOptions.map((option) => (
                                 <div key={option} className="radio-group">
                                    <RadioGroupItem
                                       value={option}
                                       id={option}
                                    />
                                    <Label
                                       htmlFor={option}
                                       className="cursor-pointer"
                                    >
                                       {option}
                                    </Label>
                                 </div>
                              ))}
                           </RadioGroup>
                        </FormControl>
                     )}
                  />
               </div>

               {/* Address & Profession */}
               <div className="flex flex-col gap-5 xl:flex-row">
                  {/* Address */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.INPUT}
                     name="address"
                     label="Adresse"
                     placeholder="14 rue ici"
                  />

                  {/* Occupation */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.INPUT}
                     name="occupation"
                     label="Profession"
                     placeholder="Votre profession"
                  />
               </div>

               {/* Emergency Contact */}
               <div className="flex flex-col gap-5 xl:flex-row">
                  {/* Contact name */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.INPUT}
                     name="emergencyContactName"
                     label="Contact en cas d'urgence"
                     placeholder="Nom de la personne à contacter"
                  />

                  {/* Contact phone */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.PHONE_INPUT}
                     name="emergencyContactNumber"
                     label="Contact en cas d'urgence"
                  />
               </div>
            </section>

            {/* Medical informations */}
            <section className="space-y-6">
               <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Informations médicales</h2>
               </div>
               {/* Doctor */}
               <CustomFormField
                  control={form.control}
                  fieldType={FormFieldsType.SELECT}
                  name="primaryPhysician"
                  label="Médecin traitant"
                  placeholder="Sélectionnez votre médecin"
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

               {/* Mutuelle & Sécurité sociale */}
               <div className="flex flex-col gap-5 xl:flex-row">
                  {/* Mutuelle */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.INPUT}
                     name="insuranceProvider"
                     label="Mutuelle"
                     placeholder="Nom de la mutuelle"
                  />

                  {/* N° sécurité sociale */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.INPUT}
                     name="insurancePolicyNumber"
                     label="Numéro de sécurité sociale"
                     placeholder="• •• •• •• ••• ••• ••"
                  />
               </div>

               {/* Allergies & traitements en cours */}
               <div className="flex flex-col gap-5 xl:flex-row">
                  {/* Mutuelle */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.TEXTAREA}
                     name="allergies"
                     label="Allergies (optionnel)"
                     placeholder="Aliments, médicaments...."
                  />

                  {/* N° sécurité sociale */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.TEXTAREA}
                     name="currentMedication"
                     label="Traitements en cours (optionnel)"
                     placeholder="Nom des médicaments"
                  />
               </div>

               {/* Antécédents */}
               <div className="flex flex-col gap-5 xl:flex-row">
                  {/* Antécédents familiaux */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.TEXTAREA}
                     name="familyMedicalHistory"
                     label="Antécédents familiaux"
                     placeholder="Maladies, traitements..."
                  />

                  {/* Antécédents personnels */}
                  <CustomFormField
                     control={form.control}
                     fieldType={FormFieldsType.TEXTAREA}
                     name="pastMedicalHistory"
                     label="Vos antécédents médicaux"
                     placeholder="Maladies, traitements, opérations..."
                  />
               </div>
            </section>

            {/* Identification et vérification */}
            <section className="space-y-6">
               <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Identification et vérification</h2>
               </div>
               {/* Identification type */}
               <CustomFormField
                  control={form.control}
                  fieldType={FormFieldsType.SELECT}
                  name="identificationType"
                  label="Type d'identification"
                  placeholder="Sélectionner un type d'identification"
               >
                  {IdentificationTypes.map((type) => (
                     <SelectItem key={type} value={type}>
                        {type}
                     </SelectItem>
                  ))}
               </CustomFormField>

               {/* Identification number  */}
               <CustomFormField
                  control={form.control}
                  fieldType={FormFieldsType.INPUT}
                  name="identificationNumber"
                  label="Numéro d'identification"
                  placeholder="123456789"
               />

               {/* File upload */}
               <CustomFormField
                  control={form.control}
                  fieldType={FormFieldsType.SKELETON}
                  name="identificationDocument"
                  label="Ajouter un document"
                  renderSkeleton={(field) => (
                     <FormControl>
                        <FileUploader
                           files={field.value}
                           onChange={field.onChange}
                        />
                     </FormControl>
                  )}
               />
            </section>

            {/* Consent & privacy*/}
            <section className="space-y-6">
               <div className="mb-9 space-y-1">
                  <h2 className="sub-header">
                     Consentement et protection de la vie privée
                  </h2>
               </div>
               <CustomFormField
                  control={form.control}
                  fieldType={FormFieldsType.CHECKBOX}
                  name="treatmentConsent"
                  label="Je consens à recevoir des traitements relatifs à mon état de santé"
               />
               <CustomFormField
                  control={form.control}
                  fieldType={FormFieldsType.CHECKBOX}
                  name="disclosureConsent"
                  label="Je consens à l'utilisation de mes informations de santé à des fins médicales"
               />
               <CustomFormField
                  control={form.control}
                  fieldType={FormFieldsType.CHECKBOX}
                  name="privacyConsent"
                  label="Je reconnais avoir pris connaissance et accepter la politique de confidentialité"
               />
            </section>

            <SubmitButton isLoading={isLoading}>Continuer</SubmitButton>
         </form>
      </Form>
   );
};

export default RegisterForm;
