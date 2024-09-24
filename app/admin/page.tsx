import { getRecentAppointmentList } from "@/actions/appointment.actions";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import StatCard from "@/components/ui/stat-card";
import Image from "next/image";
import Link from "next/link";
import React from "react";



const AdminPage = async () => {
   //*** APPOINTMENTS DATA ***//
   const appointments = await getRecentAppointmentList();
   console.log(appointments)

   return (
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
         {/* Header */}
         <header className="admin-header">
            <Link
               href={"/"}
               className="flex items-center gap-2"
               title="Accueil"
            >
               <Image
                  src={"/assets/caresync-logo.png"}
                  alt="Logo de CareSync"
                  width={28}
                  height={28}
                  className="rounded h-8 w-fit"
               />
               <p className="text-xl font-medium">CareSync</p>
            </Link>
            <p className="text-16-regular">Admin - Dashboard</p>
         </header>

         <main className="admin-main">
            <section className="w-full space-y-4">
               <h1 className="header">Bienvenue 👋</h1>
               <p className="text-dark-700">Gérer les nouveaux rendez-vous.</p>
            </section>

            <section className="admin-stat">
               <StatCard
                  type="appointments"
                  count={appointments.scheduledCount}
                  label="Rendez-vous planifiés"
                  icon="/assets/icons/appointments.svg"
               />
               <StatCard
                  type="pending"
                  count={appointments.pendingCount}
                  label="Rendez-vous en attentes"
                  icon="/assets/icons/pending.svg"
               />
               <StatCard
                  type="cancelled"
                  count={appointments.cancelledCount}
                  label="Rendez-vous annulés"
                  icon="/assets/icons/cancelled.svg"
               />
            </section>

            <DataTable data={appointments.documents} columns={columns} />
         </main>
      </div>
   );
};

export default AdminPage;
