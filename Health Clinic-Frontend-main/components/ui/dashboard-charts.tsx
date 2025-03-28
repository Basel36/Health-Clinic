"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, RadialBar,
  RadialBarChart,PolarGrid,PolarRadiusAxis,Label,XAxis, CartesianGrid, LabelList} from "recharts"
  import { useTranslations } from 'next-intl'





interface IProps{
  chartsData: object[][]
  titles:string[]
  descriptions:string[]
  role:"Doctor" | "Lab" | "Pharmacie" | "Patient" 
  year:number
}
const colors={Doctor:"hsl(var(--chart-1))",Lab:"hsl(var(--chart-2))",Pharmacie:"hsl(var(--chart-3))",Patient:"hsl(var(--chart-4))"}
export function DashboardCharts({year,chartsData,titles,descriptions,role}:IProps) {
  const t = useTranslations('Dashboard')
  const tcommon = useTranslations('common')

  const chartConfig = {
    revenue: {
      label: `${tcommon(`EGP`)}`,
      color: `${colors[role]}`,
    },
    reservations: {
      label: `${t (`${role==="Pharmacie"?"order":"reservation"}`)}`,
      color: `${colors[role]}`,
    },
   
 
  } satisfies ChartConfig
  return (
      <>
    <div className="grid gap-4  md:grid-cols-2 xl:grid-cols-3">
    <Card className="col-span-2  row-span-0">
  <CardHeader>
    <CardTitle>{t(`${titles[0]}`)}</CardTitle>
    <CardDescription>{`${t(`${descriptions[0]}`)} ${year}`}</CardDescription>
  </CardHeader>
  <CardContent >
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartsData[0]}
        margin={{
          top: 20,
         
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="key"
          tickLine={false}
          tickMargin={7}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />StatData
        <Bar dataKey="reservations" fill="var(--color-revenue)" radius={8}>
          <LabelList
            position="top"
            offset={8}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>


   
   <div className="col-span-2 sm:col-span-1 space-y-2">


    <Card  >
      <CardHeader>
        <CardTitle>{t(`${titles[1]}`)}</CardTitle>
        <CardDescription>{`${t(`${descriptions[1]}`)} ${year}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartsData[1]}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenue)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>





     {/* <Component /> */}
     <Card className="flex flex-col h-auto">
     
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square -mt-5 max-h-[250px]"
        >
          <RadialBarChart
            data={chartsData[2]}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
               fill="var(--color-revenue)"
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
           
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="pendingActors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartsData[2][0].pendingActors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {tcommon(`EGP`)}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 -mt-3 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
         The Pending actors
        </div> */}
        <div className="leading-none text-muted-foreground">
        {t(`${descriptions[2][0]}`)}
        </div>
      </CardFooter>
    </Card>
   </div>
   {/* <Card >
        <CardHeader>
          <CardTitle>New actors</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={actorsData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Line type="monotone" dataKey="total" stroke="currentColor" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* <div className="space-y-2">

      <BarComponent actors={actors} />
      <BarComponent actors={actors} />
      </div> */}
      {/* <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>  */}

    </div>
     </>

  )
}

