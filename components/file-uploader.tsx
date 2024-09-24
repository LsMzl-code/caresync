"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
   files: File[] | undefined;
   onChange: (files: File[]) => void;
};

export const FileUploader = ({ files, onChange }: FileUploaderProps) => {
   const onDrop = useCallback((acceptedFiles: File[]) => {
      // Do something with the files
      onChange(acceptedFiles);
   }, []);
   //
   const { getRootProps, getInputProps } = useDropzone({onDrop});

   return (
      <div {...getRootProps()} className="file-upload">
         <input {...getInputProps()} />
         {files && files?.length > 0 ? (
            <Image
               src={convertFileToUrl(files[0])}
               alt="Document téléchargé"
               width={1000}
               height={1000}
               className="max-h-[400px] object-cover overflow-hidden"
            />
         ) : (
            <>
               <Image
                  src={"/assets/icons/upload.svg"}
                  alt="Icon de téléchargement"
                  width={40}
                  height={40}
               />
               <div className="file-upload_label">
                  <p className="text-14-regular">
                     <span className="text-green-500">
                        Cliquez pour choisir un fichier
                     </span>
                     ou glissez-déposez ici.
                  </p>
                  <p>SVG, PNG, JPG, GIF (max: 800 x 400)</p>
               </div>
            </>
         )}
      </div>
   );
};

