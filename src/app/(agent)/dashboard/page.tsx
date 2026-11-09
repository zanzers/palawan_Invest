import PagePlaceholder from "@/components/dashboard/PagePlaceholder";
import DashboardHeader from "./DashboardHeader";

export default function DashboardHome() {
  return (
    <>
       <DashboardHeader  unreadMessages={0} unreadNotifications={0}/>
      <PagePlaceholder title="Home" note="Lisitngs, search and categories go here" />
    
    </>
   
 
  );
}

