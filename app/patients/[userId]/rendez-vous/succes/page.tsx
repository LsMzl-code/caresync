import { getAppointment } from "@/actions/appointment.actions";
import { Button } from "@/components/ui/button";
import { doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const SuccessPage = async ({
   params: { userId },
   searchParams,
}: SearchParamProps) => {
   //*** CURRENT APPOINTMENT DATA ***//
   // Get the params in the url
   const appointmentId = (searchParams?.appointmentId as string) || "";
   const appointment = await getAppointment(appointmentId);

   const doctor = doctors.find(
      (doc) => doc.name === appointment.primaryPhysician
   );

   return (
      <div className="flex h-screen max-h-screen py-[5%]">
         <div className="success-img">
            {/* Logo */}
            <Link href={"/"} className="flex items-center gap-2">
               <Image
                  src={"/assets/caresync-logo.png"}
                  alt="Logo de CareSync"
                  width={40}
                  height={40}
                  className="rounded"
               />
               <h1 className="text-3xl font-medium">CareSync</h1>
            </Link>

            {/* Success image  & message*/}
            <section className="flex flex-col items-center">
               <Image
                  src={"/assets/gifs/success.gif"}
                  alt="Animation de succès"
                  height={300}
                  width={280}
                  unoptimized
               />
               <h2 className="header mb-6 max-w-[600px] text-center">
                  Votre <span className="text-green-500">rendez-vous</span> a
                  bien été pris en compte!
               </h2>
               <p>Vous recevrez prochainement un sms de confirmation.</p>
            </section>

            {/* Reservations details */}
            <section className="request-details">
               <p className="sub-header">Détails de votre rendez-vous:</p>
               <div className="flex items-center gap-3">
                  <Image
                     src={doctor?.image!}
                     alt={doctor?.name!}
                     height={100}
                     width={100}
                     className="size-14"
                  />
                  <p className="whitespace-nowrap">Dr.{doctor?.name}</p>
               </div>
               <div className="flex gap-2">
                  <Image
                     src={"/assets/icons/calendar.svg"}
                     alt="Calendrier"
                     height={24}
                     width={24}
                  />
                  <p>{formatDateTime(appointment.schedule).dateTime}</p>
               </div>
            </section>

            <Button variant="outline" className="shad-primary-btn" asChild>
               <Link
                  href={`/patients/${userId}/rendez-vous`}
                  title="Prendre un nouveau rendez-vous"
               >
                  Nouveau rendez-vous
               </Link>
            </Button>
            <p className="copyright">© 2024 CareSync</p>
         </div>
      </div>
   );
};

export default SuccessPage;
