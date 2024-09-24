"use client";
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FormFieldsType } from "../forms/patient-form";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./select";
import { Textarea } from "./textarea";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

registerLocale("fr", fr);

interface CustomProps {
   control: Control<any>;
   fieldType: FormFieldsType;
   name: string;
   label?: string;
   placeholder?: string;
   iconSrc?: string;
   iconAlt?: string;
   disabled?: boolean;
   dateFormat?: string;
   showTimeSelect?: boolean;
   children?: React.ReactNode;
   renderSkeleton?: (field: any) => React.ReactNode;
}

/**
 *
 * @param param0
 * @returns
 */
const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
   switch (props.fieldType) {
      case FormFieldsType.INPUT:
         return (
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
               {props.iconSrc && (
                  <Image
                     src={props.iconSrc}
                     alt={props.iconAlt || "icone"}
                     width={24}
                     height={40}
                     className="ml-2"
                  />
               )}
               <FormControl>
                  <Input
                     placeholder={props.placeholder}
                     {...field}
                     className="shad-input border-0"
                  />
               </FormControl>
            </div>
         );
      case FormFieldsType.PHONE_INPUT:
         return (
            <FormControl>
               <PhoneInput
                  defaultCountry="FR"
                  placeholder={props.placeholder}
                  international
                  // withcountrucallingcode
                  value={field.value}
                  onChange={field.onChange}
                  className="input-phone"
               />
            </FormControl>
         );
      case FormFieldsType.DATE_PICKER:
         return (
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
               <Image
                  src={"/assets/icons/calendar.svg"}
                  alt="Calendrier"
                  height={24}
                  width={24}
                  className="ml-2"
               />
               <FormControl>
                  <ReactDatePicker
                     showTimeSelect={props.showTimeSelect ?? false}
                     selected={field.value}
                     onChange={(date) => field.onChange(date)}
                     locale="fr"
                     dateFormat={props.dateFormat ?? "dd/MM/yyyy"}
                     timeInputLabel="Time:"
                     wrapperClassName="date-picker"
                  />
               </FormControl>
            </div>
         );
      case FormFieldsType.SKELETON:
         return props.renderSkeleton ? props.renderSkeleton(field) : null;
      case FormFieldsType.SELECT:
         return (
            <FormControl>
               <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
               >
                  <FormControl>
                     <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder={props.placeholder} />
                     </SelectTrigger>
                  </FormControl>
                  <SelectContent className="shad-select-content">
                     {props.children}
                  </SelectContent>
               </Select>
            </FormControl>
         );
      case FormFieldsType.CHECKBOX:
         return (
            <FormControl>
               <div className="flex items-center gap-4">
                  <Checkbox
                     id={props.name}
                     checked={field.value}
                     onCheckedChange={field.onChange}
                  />
                  <Label htmlFor={props.name} className="checkbox-label">
                     {props.label}
                  </Label>
               </div>
            </FormControl>
         );
      case FormFieldsType.TEXTAREA:
         return (
            <FormControl>
               <Textarea
                  {...field}
                  placeholder={props.placeholder}
                  className="shad-textArea"
                  disabled={props.disabled}
               />
            </FormControl>
         );
      default:
         break;
   }
};

/**
 *
 * @param props
 * @returns
 */
const CustomFormField = (props: CustomProps) => {
   //*** ***//
   const { control, fieldType, name, label } = props;

   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className="flex-1">
               {fieldType !== FormFieldsType.CHECKBOX && label && (
                  <FormLabel>{label}</FormLabel>
               )}
               <RenderField field={field} props={props} />

               <FormMessage className="shad-error" />
            </FormItem>
         )}
      />
   );
};

export default CustomFormField;
