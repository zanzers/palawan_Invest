import { type RefObject } from "react";
import { Filters } from "@/type/filterType";


type Props = { unreadMessages?: number; unreadNotifications?: number;};
type PropsLocations = { locations: readonly string[]; types: readonly string[] };


type SearchProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  formKey: number;
  locations: readonly string[];
  types: readonly string[];
  value: Filters;
  onApply: (f: Filters) => void;
};







export type {
  Props,
  SearchProps,
  PropsLocations

}