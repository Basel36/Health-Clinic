"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, Trash2, TestTube, Pill } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { shortName } from '@/lib/utils'
import useCartStore from '@/lib/cart'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MedicineCashPayment, MedicineOnlinePayment, TestCashPayment, TestOnlinePayment } from '@/lib/patient/clientApi'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from '@/components/Spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DaysOfWeek, HandleTimeFormat } from '@/schema/Essentials'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cartFormSchema, type CartFormData } from "@/schema/cart-form"
import { useTranslations } from 'next-intl'


export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const { cart, isLoading, error, fetchCart, removeMedicine, updateMedicineQuantity, removeTest } = useCartStore()
  const router = useRouter()
  const [availableDatesMap, setAvailableDatesMap] = useState<Record<string, Date[]>>({})
  const t = useTranslations('patient.cart')
  const tcommon = useTranslations('common')
  const tday = useTranslations('days')

  const form = useForm<CartFormData>({
    resolver: zodResolver(cartFormSchema),
    defaultValues: {
      labSchedules: cart?.tests.map(lab => ({
        labId: lab.id,
        selectedDay: "",
        selectedDate: ""
      })) || [],
      paymentMethod: "cash"
    }
  })


  const getNextFiveDates = useCallback((day: string) => {
    const dayIndex = DaysOfWeek.indexOf(day.toLowerCase());
    const today = new Date();
    const dates: Date[] = [];
    const currentDate = new Date(today);

    while (dates.length < 5) {
      if (currentDate.getDay() === dayIndex) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, []);



  useEffect(() => {
    form.watch("labSchedules").forEach((schedule) => {
      if (schedule.selectedDay && !availableDatesMap[schedule.labId]) {
        const dates = getNextFiveDates(schedule.selectedDay);
        setAvailableDatesMap(prev => ({
          ...prev,
          [schedule.labId]: dates
        }));
      }
    });
  }, [form.watch("labSchedules"), getNextFiveDates]);
  const handleCartUpdate = useCallback((event: MessageEvent) => {
    const { type } = event.data
    if (type === 'UPDATE_CART') {
      fetchCart()
    }
  }, [fetchCart])


  useEffect(() => {
    console.log(cart)
    fetchCart()
    const channel = new BroadcastChannel('cart_channel')
    channel?.postMessage({ type: 'UPDATE_CART' })
    channel.addEventListener('message', handleCartUpdate)
    return () => {
      channel.removeEventListener('message', handleCartUpdate)
      channel.close()
    }
  }, [fetchCart, handleCartUpdate])

  const handleTestCheckout = async () => {
    const values = form.getValues()
    if (values.labSchedules.length<=0) {
      toast.error("You Didn't Choose Day and Date of some lab", {
                duration: 2000,
                position: 'bottom-center',
              })
              return
    }
    const data:{labId:string,date:string}=values.labSchedules.map(lab => {return {labId:lab.labId,date:lab.selectedDate}})
    console.log({data})
    setIsCheckingOut(true)
    try {
      if (values.paymentMethod === 'visa') {
        const res = await TestOnlinePayment(cart!.id,{data})
        if (res?.success) {
          router.push(res?.data.session.url)
        } else {
          toast.error(res?.message[0] || "Something went wrong! Try Again Later", {
            duration: 2000,
            position: 'bottom-center',
          })
        }
      } else if (values.paymentMethod === 'cash') {
        const res = await TestCashPayment({data})
        if (res?.success) {
          toast.success(res.data.message, {
            duration: 2000,
            position: 'bottom-center',
          })
          setTimeout(() => {
            fetchCart()
          }, 4000)
        } else {
          toast.error(res.message? res.message:"You have reserved this test with same day before", {
            duration: 2000,
            position: 'bottom-center',
          })
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error("An unexpected error occurred. Please try again.", {
        duration: 2000,
        position: 'bottom-center',
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleMedicineCheckout = async () => {
    setIsCheckingOut(true)
    try {
      if (form.watch("paymentMethod") === 'visa') {
        const res = await MedicineOnlinePayment(cart!.id)
        if (res) {
          router.push(res?.data.session.url)
        } else {
          throw new Error("Invalid response from MedicineOnlinePayment")
        }
      } else if (form.watch("paymentMethod") === 'cash') {
        const res = await MedicineCashPayment()
        if (res) {
          toast.success(res.data.message, {
            duration: 2000,
            position: 'bottom-center',
          })
          setTimeout(() => {
            fetchCart()
          }, 4000)
        } else {
          throw new Error("Invalid response from MedicineCashPayment")
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error("Something went wrong! Try Again Later", {
        duration: 2000,
        position: 'bottom-center',
      })
    } finally {
      setIsCheckingOut(false)
    }
  }
  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }, []);

  if (isLoading) {

    return (
      <div className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background text-foreground  flex items-center justify-center">

        <Spinner invert />
      </div>
    )
  }

  if (error) {
    return <div className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background text-foreground  flex items-center justify-center">
      {error}</div>
  }

  const renderMedicines = () => (
    <>
      {cart!.medicines.map((pharmacy) => (
        <div key={pharmacy.id} className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={pharmacy.pharmacyId.profilePic} alt={pharmacy.pharmacyId.name} />
              <AvatarFallback>{shortName(pharmacy.pharmacyId.name)}</AvatarFallback>
            </Avatar>
            <div>

              <h3 className="text-xl font-semibold">{pharmacy.pharmacyId.name}</h3>
              {/* <p className="text-xs text-muted-foreground">Locations: {pharmacy.pharmacyId.address}</p> */}
            </div>
          </div>
          {pharmacy.purchasedMedicines.map((medicine) => (
            <Card key={medicine.id} className="mb-4">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Pill className="w-5 h-5" />
                  <div>
                    <CardTitle>{medicine.medicineId.medicine.name}</CardTitle>
                    <CardDescription>{`${t(`Price`)}: ${medicine.price} ${tcommon(`EGP`)}`}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateMedicineQuantity(medicine.medicineId.id, medicine.quantity - 1)}
                      disabled={medicine.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-sm text-center">{medicine.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateMedicineQuantity(medicine.medicineId.id, medicine.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-lg font-semibold flex space-x-1 items-center">
                    <h5>{t(`Total_Price`)}</h5>
                    <p className="text-md font-semibold">{`${medicine.price * medicine.quantity} ${tcommon(`EGP`)}`}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="destructive" size="sm" onClick={() => removeMedicine(medicine.id)}>
                  <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-1" />
                  {t(`Remove`)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ))}
    </>
  )

  const renderTests = () => (
    <>
      {cart.tests.map((lab, index) => (
        <div key={lab.id} className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={lab.labId.profilePic} alt={lab.labId.name} />
              <AvatarFallback>{shortName(lab.labId.name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{lab.labId.name}</h3>
          </div>
          {lab.purchasedTests.map((test) => (
            <Card key={test.id} className="mb-4">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TestTube className="w-5 h-5" />
                  <div>
                    <CardTitle>{test.testId.test.name}</CardTitle>
                    <CardDescription>{`${t(`Price`)}: ${test.price} ${tcommon(`EGP`)}`}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold mb-1">{t(`Preparations`)}</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {test.testId.preparations.length > 0 ? test.testId.preparations.map((prep, index) => (
                        <li key={index}>{prep}</li>
                      )) : <li>{t(`None`)}</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="destructive" size="sm" onClick={() => removeTest(test.id)}>
                  <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-1r-2" />
                  {t(`Remove`)}
                </Button>
              </CardFooter>
          
            </Card>
            
          ))}
              <div className="flex items-center gap-2 mt-4">
                <div className="w-full">
                  <Label>{t(`Select_Day`)}</Label>
                  <Select
                    onValueChange={(value) => {
                      form.setValue(`labSchedules.${index}.selectedDay`, value)
                      form.setValue(`labSchedules.${index}.labId`, lab.labId.id)
                      const dates = getNextFiveDates(value)
                      setAvailableDatesMap(prev => ({
                        ...prev,
                        [lab.id]: dates
                      }))
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t(`Select_Day_placeholder`)} />
                    </SelectTrigger>
                    <SelectContent>
                      {lab.labId.schedule.days.map((day) => (
                        <SelectItem key={day.day} value={day.day}>
                          {`${tday(`${(day.day).toLowerCase()}`)} (${HandleTimeFormat(day.startTime)} - ${HandleTimeFormat(day.endTime)})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <Label>{t(`Select_Date`)}</Label>
                  <Select
                    disabled={!form.watch(`labSchedules.${index}.selectedDay`)}
                    onValueChange={(value) => {
                      form.setValue(`labSchedules.${index}.selectedDate`, value)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t(`Select_Date_placeholder`)} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDatesMap[lab.id]?.map((date) => (
                        <SelectItem key={date.toISOString()} value={date.toISOString()}>
                          {formatDate(date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
        </div>
      ))}
    </>
  )

  return (
    <main className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{t(`Your_Cart`)}</h1>
        <Tabs defaultValue="medicines" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="medicines">{`${t(`Medicines`)} (${cart ? cart.medicines.flatMap(p => p.purchasedMedicines).length : 0})`} </TabsTrigger>
            <TabsTrigger value="tests">{`${t(`Tests`)} (${cart ? cart.tests.flatMap(l => l.purchasedTests).length : 0})`}</TabsTrigger>
          </TabsList>
          <TabsContent value="medicines">
            {cart && cart.medicines.length > 0 ? (
              <>
                {renderMedicines()}
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">{t(`Total`)}</h2>
                      <p className="text-2xl font-bold">{`${cart.totalMedicinePrice} ${tcommon(`EGP`)}`} </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">{t(`Payment_Method`)}</h3>
                      <RadioGroup
                        value={form.watch("paymentMethod")}
                        onValueChange={(value) => form.setValue("paymentMethod", value as 'cash' | 'visa')}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                          <Label
                            htmlFor="cash"
                            className="flex items-center space-x-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <rect width="20" height="12" x="2" y="6" rx="2" />
                              <circle cx="12" cy="12" r="2" />
                              <path d="M6 12h.01M18 12h.01" />
                            </svg>
                            <span>{t(`Cash`)}</span>
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="visa" id="visa" className="peer sr-only" />
                          <Label
                            htmlFor="visa"
                            className="flex items-center space-x-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <rect width="20" height="14" x="2" y="5" rx="2" />
                              <line x1="2" x2="22" y1="10" y2="10" />
                            </svg>
                            <span>{t(`Visa`)}</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleMedicineCheckout}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? <Spinner /> : t(`submit`)}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-lg mb-4">{t(`No_Medicines`)}</p>
                  <Link href="/patient/pharmacies">
                    <Button>{t(`Browse_Medicines`)}</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="tests">
            {cart && cart.tests.length > 0 ? (
              <>
                {renderTests()}
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">{t(`Total`)}</h2>
                      <p className="text-2xl font-bold">{`${cart.totalTestPrice} ${tcommon(`EGP`)}`}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">{t(`Payment_Method`)}</h3>
                      <RadioGroup
                        value={form.watch("paymentMethod")}
                        onValueChange={(value) => form.setValue("paymentMethod", value as 'cash' | 'visa')}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                          <Label
                            htmlFor="cash"
                            className="flex items-center space-x-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <rect width="20" height="12" x="2" y="6" rx="2" />
                              <circle cx="12" cy="12" r="2" />
                              <path d="M6 12h.01M18 12h.01" />
                            </svg>
                            <span>{t(`Cash`)}</span>
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="visa" id="visa" className="peer sr-only" />
                          <Label
                            htmlFor="visa"
                            className="flex items-center space-x-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <rect width="20" height="14" x="2" y="5" rx="2" />
                              <line x1="2" x2="22" y1="10" y2="10" />
                            </svg>
                            <span>{t(`Visa`)}</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleTestCheckout}
                      disabled={isCheckingOut || !form.watch("labSchedules").every(schedule => schedule.selectedDate)}
                    >
                      {isCheckingOut ? <Spinner />: t(`submit`)}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-lg mb-4">{t(`No_Tests`)}</p>
                  <Link href="/patient/labs">
                    <Button>{t(`Browse_Tests`)}</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </main>
  )
}

