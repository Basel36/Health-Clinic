import { FadeText } from "@/components/ui/fade-text";
import { cookies } from 'next/headers'; // Import cookies function from Next.js

interface IProps {
  name: string
}

export async function WelcomeUser({name=''}:IProps) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user'); // Assuming the user info is stored in 'user' cookie
  const  user = JSON.parse(userCookie.value); 
  return (
 

      <FadeText
      className="text-xs md:text-lg font-bold text-black dark:text-white"
      direction="left"
      framerProps={{
        show: { transition: { delay: 0 } },
      }}
      text={<>Welcome, {user.role==='doctor'?"Dr. ":null}  {name.split(' ')[0]} <span className="hidden md:inline">{name.split(' ')[1]}</span></>}
    />
    

  );
}
