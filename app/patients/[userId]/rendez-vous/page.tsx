import { getPatient } from "@/actions/patient.actions";
import AppointmentForm from "@/components/forms/appointment-form";
import Image from "next/image";

export default async function AppointmentPage({
   params: { userId },
}: SearchParamProps) {
   //*** CURRENT PATIENT DATA ***//
   const patient = await getPatient(userId);

   return (
      <div className="flex h-screen max-h-screen">
         <section className="remove-scrollbar container my-auto">
            <div className="sub-container max-w-[860px] flex-1 justify-between">
               {/* Logo */}
               <div className="flex items-center mb-12 gap-2">
                  <Image
                     src={"/assets/caresync-logo.png"}
                     alt="Logo de CareSync"
                     width={40}
                     height={40}
                     className="rounded"
                  />
                  <h1 className="text-3xl font-medium">CareSync</h1>
               </div>

               <AppointmentForm
                  type="create"
                  userId={userId}
                  patientId={patient.$id}
               />

               <p className="py-12 copyright">© 2024 CareSync</p>
            </div>
         </section>

         <Image
            src={"/assets/images/appointment-img.png"}
            alt="Rendez-vous"
            width={1000}
            height={1000}
            className="side-img max-w-[390px] bg-bottom"
            priority
         />
      </div>
   );
}
