import BlurFade from "@/components/ui/blur-fade";

export default function AuthLayout({
      children, // will be a page or nested layout
    }: {
      children: React.ReactNode
    }) {
      return (
        <html lang="en">
        <body>  
        <BlurFade delay={0} className="flex min-h-screen w-full" inView>
        {/* <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"> */}
    
       
      
      {children}
      {/* <Toaster /> */}
                  </BlurFade>
                  </body>
                  </html>
      )
     
            
    
    }