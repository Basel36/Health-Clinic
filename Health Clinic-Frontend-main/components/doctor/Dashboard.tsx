import {  Card,
      CardContent,
      CardHeader,
      CardTitle, } from "@/components/ui/card"
import {Banknote,TrendingUp,Users} from "lucide-react"
import NumberTicker from "../ui/number-ticker"
import { cookies } from 'next/headers'; // Import cookies function from Next.js

interface IProps{
  todayResults: number;
  prevMonthResults: number;
  monthResults: number;

}
const Dashboard =({monthResults,todayResults,prevMonthResults}:IProps)=>{
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user'); // Assuming the user info is stored in 'user' cookie
  const  user = JSON.parse(userCookie.value); 
  const profit =(user.schedule.cost*monthResults)-(user.schedule.cost*prevMonthResults);
  const profitPercentage = prevMonthResults!==0?((user.schedule.cost*monthResults-user.schedule.cost*prevMonthResults)/(prevMonthResults*user.schedule.cost))*100: 100
      return(
        <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">    {monthResults?  <NumberTicker value={user.schedule.cost*monthResults} />:0}EGP</div>
              <p className="text-xs text-muted-foreground">
               This Month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Patients
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
          {monthResults?  <NumberTicker value={monthResults} />:0}
          {/* <NumberTicker value={monthResults} /> */}
          </div>
          <p className="text-xs text-muted-foreground">
           This Month
          </p>
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Patients
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
          {todayResults?  <NumberTicker value={todayResults} />:0}
          {/* <NumberTicker value={todayResults} /> */}
          </div>
          <p className="text-xs text-muted-foreground">
           Waiting Today
          </p>
        </CardContent>
      </Card>
      <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Profit</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{profit>0?"+":null}<NumberTicker value={profit}/>EGP</div>
              <p className="text-xs text-muted-foreground">
                {profitPercentage}% from last month
              </p>
            </CardContent>
          </Card>
        
          </div>
      )
}

export default Dashboard