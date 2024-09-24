"use client";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PasskeyModal = () => {
   //*** STATES ***//
   const [open, setOpen] = useState<boolean>(true);
   const [passkey, setPasskey] = useState<string>("");
   const [error, setError] = useState<string>("");

   //*** HOOKS ***//
   const router = useRouter();
   const path = usePathname();

   //*** LOCAL STORAGE ***//
   const encryptedKey =
      typeof window !== "undefined"
         ? window.localStorage.getItem("accessKey")
         : null;

   // If the password is already in the localStorage
   useEffect(() => {
      // Decrypt the passkey
      const accessKey = encryptedKey && decryptKey(encryptedKey);
      // If the accessKey matches the admin passkey, redirect to the admin page
      if (path) {
         if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            setOpen(false);
            router.push("/admin");
         } else {
            setOpen(true);
         }
      }
   }, [encryptedKey]);

   //*** ACTIONS ***//
   const closeModal = () => {
      setOpen(false);
      router.push("/");
   };
   //
   const validatePassKey = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
   ) => {
      e.preventDefault();

      if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
         const encryptedKey = encryptKey(passkey);
         localStorage.setItem("accessKey", encryptedKey);
         setOpen(false);
      } else {
         setError("Code invalide");
         setTimeout(() => {
            setPasskey("");
            setError("");
         }, 2000);
      }
   };

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogContent className="shad-alert-dialog rounded-md">
            <AlertDialogHeader>
               <AlertDialogTitle className="flex items-start justify-between">
                  Vérification administrateur
                  <Image
                     src={"/assets/icons/close.svg"}
                     alt="Fermeture"
                     width={20}
                     height={20}
                     onClick={() => closeModal()}
                     className="cursor-pointer hover:animate-spin"
                  />
               </AlertDialogTitle>
               <AlertDialogDescription className="text-start">
                  Merci d'entrer votre code administrateur pour continuer
               </AlertDialogDescription>
            </AlertDialogHeader>
            {/* Passkey */}
            <div>
               <InputOTP
                  maxLength={6}
                  value={passkey}
                  onChange={(value) => setPasskey(value)}
               >
                  <InputOTPGroup className="shad-otp">
                     <InputOTPSlot index={0} className="shad-otp-slot" />
                     <InputOTPSlot index={1} className="shad-otp-slot" />
                     <InputOTPSlot index={2} className="shad-otp-slot" />
                     <InputOTPSlot index={3} className="shad-otp-slot" />
                     <InputOTPSlot index={4} className="shad-otp-slot" />
                     <InputOTPSlot index={5} className="shad-otp-slot" />
                  </InputOTPGroup>
               </InputOTP>
               {/* Error message */}
               {error && (
                  <p className="shad-error text-14-regular mt-4 flex justify-center">
                     {error}
                  </p>
               )}
            </div>
            <AlertDialogFooter>
               <AlertDialogAction
                  className="shad-primary-btn w-full"
                  onClick={(e) => validatePassKey(e)}
               >
                  Valider
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};

export default PasskeyModal;
