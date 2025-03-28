import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserPlus, DollarSign ,FlaskConical,Hospital,Pill,DoorOpen,Microscope} from 'lucide-react'
import NumberTicker from "../ui/number-ticker";
import { useTranslations } from 'next-intl'

interface IStat{
   title: string
    value: number
    icon: string
    paragragph?:string
}

interface IProps{
  stats:IStat[]
}


const iconMap = {
  Users, UserCheck, UserPlus, DollarSign,DoorOpen,Pill,FlaskConical,Hospital,Microscope
};
export function StatisticsCards({stats}:IProps) {
  const t = useTranslations('Statistics_Cards')

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];
        return(
        <Card key={t(`${stat.title}`)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t(`${stat.title}`)}</CardTitle>
            <Icon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value>0 ?<NumberTicker value={stat.value} /> :stat.value}</div>
       
            <p className="text-xs text-muted-foreground">{t(`${stat.paragragph}`)}</p>
          </CardContent>
        </Card>
      )})}
    </div>
  )
}

