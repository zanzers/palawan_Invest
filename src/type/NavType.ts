import { HouseIcon, PlusCircleIcon, UserCircleIcon, type Icon } from "@phosphor-icons/react";


type Item = {  href: string;  label: string;  Icon: Icon;  exact?: boolean; };

export const ITEMS: Item[] = [
  { href: "/dashboard",  label: "Home",  Icon: HouseIcon,  exact: true },
  { href: "/dashboard/add",  label: "Add",  Icon: PlusCircleIcon},
  { href: "/dashboard/contact",  label: "Contact",  Icon: UserCircleIcon},

];


