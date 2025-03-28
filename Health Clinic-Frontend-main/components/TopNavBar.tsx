import { ModeToggle } from "./ui/ModeToggle"
import { WelcomeUser } from "./WelcomUser"
import { cookies } from 'next/headers'; // Import cookies function from Next.js
import LanguageSwitcherIcon from "./LanguageSwitcherIcon"
import MobileNav from "./MobileNav"
import TopNavBarMenu from "./TopNavBarMenu"
interface NavItem {
  href: string;
  icon: string;
  label: string;
}

interface IProps {
  navItems: NavItem[];
}
const TopNavBar = ({navItems}:IProps) => {

  const cookieStore = cookies();
  const userCookie = cookieStore.get('user'); // Assuming the user info is stored in 'user' cookie
  
  // Extract the user name if the cookie exists
let user;
  if (userCookie) {
     user = JSON.parse(userCookie.value); // Parse cookie if it's stored as a JSON object
     // Get the name from the user object
  }
  return (
    <header className="flex h-12 sm:h-14 items-center gap-1 border-b bg-muted/40 px-2 sm:px-4 lg:h-[60px] lg:px-6">
      <MobileNav navItems={navItems} role={user.role}/>
      <div className="flex-1" />
      <div className="flex items-center justify-between w-full">
        <WelcomeUser name={user.name} />
        <div className="flex items-center">
          <LanguageSwitcherIcon />
          <ModeToggle />
         <TopNavBarMenu user={user} />
        </div>
      </div>
    </header>
  )
}

export default TopNavBar