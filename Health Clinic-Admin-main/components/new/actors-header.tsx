import { useTranslations } from 'next-intl'

type role= "Patient" | "Pharmacie" | "Lab" | "Doctor" 

export function ActorsHeader({role}:{role:role}) {
  const t = useTranslations('header')

  return (
    <div className="flex items-center justify-between p-2">

      <h1 className="text-3xl font-bold text-center">{t(`${role}s_Management`)}</h1>
     
    </div>
  )
}

