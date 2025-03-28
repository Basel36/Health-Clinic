import {  Card,
      CardContent,
      CardHeader,
      CardTitle, } from "@/components/ui/card"
import {Users} from "lucide-react"
import NumberTicker from "../ui/number-ticker"
const Patients =()=>{
      return(
        <Card x-chunk="dashboard-01-chunk-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Patients
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
          <NumberTicker value={100} />
          </div>
          <p className="text-xs text-muted-foreground">
           This Month
          </p>
        </CardContent>
      </Card>
      )
}

export default Patients