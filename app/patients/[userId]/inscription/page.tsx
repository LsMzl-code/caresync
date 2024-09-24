import { getUser } from "@/actions/patient.actions";
import RegisterForm from "@/components/forms/register-form";
import Image from "next/image";

const RegisterPage = async ({ params: { userId } }: SearchParamProps) => {
   //*** CURRENT USER DATA ***//
   const user = await getUser(userId);

   return (
      <div className="flex h-screen max-h-screen">
         <section className="remove-scrollbar container">
            <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
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

               <RegisterForm user={user} />

               <p className="py-12 copyright">© 2024 CareSync</p>
            </div>
         </section>

         <Image
            src={"/assets/images/register-img.png"}
            alt="Patient"
            width={1000}
            height={1000}
            className="side-img max-w-[390px]"
            priority
         />
      </div>
   );
};

export default RegisterPage;
