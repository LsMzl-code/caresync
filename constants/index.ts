/**
 * Genre de l'utilisateur (homme, femme, autre)
 */
export const genderOptions = ["homme", "femme", "autre"];

/**
 * Médecins pour le choix du médecin traitant.
 */
export const doctors = [
   {
      image: "/assets/images/dr-green.png",
      name: "Léo Darnier",
   },
   {
      image: "/assets/images/dr-cameron.png",
      name: "Emma Valmont",
   },
   {
      image: "/assets/images/dr-livingston.png",
      name: "Nathan Lemoine",
   },
   {
      image: "/assets/images/dr-peter.png",
      name: "Camille Bourdet",
   },
   {
      image: "/assets/images/dr-powell.png",
      name: "Clara Vasseur",
   },
   {
      image: "/assets/images/dr-remirez.png",
      name: "Julien Rochefort",
   },
   {
      image: "/assets/images/dr-lee.png",
      name: "Manon Laville",
   },
   {
      image: "/assets/images/dr-cruz.png",
      name: "Sarah Fontenay",
   },
   {
      image: "/assets/images/dr-sharma.png",
      name: "Arthur Girard",
   },
];

/**
 *
 */
export const IdentificationTypes = [
   "Certificat de naissance",
   "Carte d'identitié",
   "Passport",
   "Carte vitale",
   "Permis de conduire",
   "Attestation d'assurance",
   "Carte étudiant",
   "Carte de militaire",
];

export const PatientFormDefaultValues = {
   firstName: "",
   lastName: "",
   email: "",
   phone: "",
   birthDate: new Date(Date.now()),
   gender: "homme" as Gender,
   address: "",
   occupation: "",
   emergencyContactName: "",
   emergencyContactNumber: "",
   primaryPhysician: "",
   insuranceProvider: "",
   insurancePolicyNumber: "",
   allergies: "",
   currentMedication: "",
   familyMedicalHistory: "",
   pastMedicalHistory: "",
   identificationType: "Certificat de naissance",
   identificationNumber: "",
   identificationDocument: [],
   treatmentConsent: false,
   disclosureConsent: false,
   privacyConsent: false,
};


export const StatusIcon = {
   scheduled: "/assets/icons/check.svg",
   pending: "/assets/icons/pending.svg",
   cancelled: "/assets/icons/cancelled.svg",
 };