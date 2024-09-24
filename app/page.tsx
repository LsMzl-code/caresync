import PatientForm from "@/components/forms/patient-form";
import PasskeyModal from "@/components/passkey-modal";
import Image from "next/image";
import Link from "next/link";

export default function HomePage({ searchParams }: SearchParamProps) {
   //*** CURRENT USER ROLE ***//
   const isAdmin = searchParams.admin === "true";
   return (
      <div className="flex h-screen max-h-screen">
         {/* Admin modal verification */}
         {isAdmin && (
            <PasskeyModal/>
         )}
         <section className="remove-scrollbar container my-auto">
            <div className="sub-container max-w-[496px]">
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

               <PatientForm />

               <div className="text-14-regular mt-20 flex justify-between">
                  <p className="justify-items-end text-dark-600 xl:text-left">
                     © 2024 CareSync
                  </p>
                  <Link href={"/?admin=true"} className="text-green-500">
                     Admin
                  </Link>
               </div>
            </div>
         </section>

         <Image
            src={"/assets/images/onboarding-img.png"}
            alt="Patient"
            width={1000}
            height={1000}
            className="side-img max-w-[50%]"
            priority
         />
      </div>
   );
}
