"use client";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import AppointmentForm from "./forms/appointment-form";
import { Appointment } from "@/types/appwrite.types";

const AppointementModal = ({
   type,
   patientId,
   appointment,
   userId,
}: {
   type: "schedule" | "cancel";
   patientId: string;
   userId: string;
   appointment?: Appointment; // For schedule type only
}) => {
   //*** STATES ***//
   const [open, setOpen] = useState<boolean>(false);

   //*** HOOKS ***//
   //    const router = useRouter();
   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button
               variant="ghost"
               className={`capitalize ${
                  type === "schedule" && "text-green-500"
               }`}
            >
               {type === "schedule" ? "Confirmer" : "Annuler"}
            </Button>
         </DialogTrigger>
         <DialogContent className="rounded-md shad-dialog sm:max-w-md md:max-w-2xl">
            <DialogHeader className="text-start mb-4 space-y-3">
               <DialogTitle>
                  {type === "schedule" ? "Confirmer" : "Annuler"} un
                  rendez-vous
               </DialogTitle>
               <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
               </DialogDescription>
            </DialogHeader>
            <AppointmentForm
               userId={userId}
               patientId={patientId}
               type={type}
               appointment={appointment}
               setOpen={setOpen}
            />
         </DialogContent>
      </Dialog>
   );
};

export default AppointementModal;
