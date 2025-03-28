import Spinner from "@/components/Spinner"
import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog"
import { useTranslations } from 'next-intl'
    
    type CancelModalProps = {
      isOpen: boolean
      isLoading: boolean
      onClose: () => void
      onConfirm: () => void
      itemName: string
    }
    
    export default function CancelModal({ isOpen, onClose, onConfirm,isLoading, itemName }: CancelModalProps) {
          const t = useTranslations('patient.my_activity')
      
      return (
        <AlertDialog open={isOpen} >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t(`cancel_title`)}</AlertDialogTitle>
              <AlertDialogDescription>
                {t(`cancel_description`,{itemName})}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onClose}>{t(`Cancel`)}</AlertDialogCancel>
              <AlertDialogAction onClick={()=>{onConfirm()}}>{isLoading?<Spinner />:t(`cancel_submit`)}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }
    
    