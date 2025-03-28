'use client'
import React, { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, X } from "lucide-react"

interface UserData {
  name: string
  email: string
  password: string
  address: string
  phone: string
  profilePic: string
  licensePics: string[]
}
const UpdateProfile =()=>{
      const [errors, setErrors] = useState<Partial<UserData>>({})
      const [isModalOpen, setIsModalOpen] = useState(false)
      const [userData, setUserData] = useState<UserData>({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "********",
            address: "123 Main St, Anytown, USA",
            phone: "+1 (555) 123-4567",
            profilePic: "/placeholder.svg?height=128&width=128",
            licensePics: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
          })
        
          const [formData, setFormData] = useState<UserData>(userData)
         
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
      const validateForm = () => {
            const newErrors: Partial<UserData> = {}
            Object.entries(formData).forEach(([key, value]) => {
              if (key !== 'licensePics' && !value) {
                newErrors[key as keyof UserData] = "This field cannot be empty"
              }
            })
            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
          }
        
          const handleUpdate = () => {
            if (validateForm()) {
              setUserData(formData)
              setIsModalOpen(false)
            }
          }
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'license') => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => {
                if (type === 'profile') {
                  setFormData((prev) => ({ ...prev, profilePic: reader.result as string }))
                } else {
                  setFormData((prev) => ({ ...prev, licensePics: [...prev.licensePics, reader.result as string] }))
                }
              }
              reader.readAsDataURL(file)
            }
          }
        
          const removeLicensePic = (index: number) => {
            setFormData((prev) => ({
              ...prev,
              licensePics: prev.licensePics.filter((_, i) => i !== index),
            }))
          }    
      return(
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Update Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Profile</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="profilePic">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={formData.profilePic} alt={formData.name} />
                        <AvatarFallback>{formData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <Input
                        id="profilePic"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'profile')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
               
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>License Pictures</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {formData.licensePics.map((pic, index) => (
                        <div key={index} className="relative">
                          <Image src={pic} alt={`License ${index + 1}`} className="w-32 h-24 object-cover rounded" />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeLicensePic(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <label htmlFor="licensePic" className="w-32 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer">
                        <PlusCircle className="h-8 w-8 text-gray-400" />
                        <Input
                          id="licensePic"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'license')}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <Button onClick={handleUpdate} className="w-full mt-4">
                Update
              </Button>
            </DialogContent>
          </Dialog>
      )
}

export default UpdateProfile