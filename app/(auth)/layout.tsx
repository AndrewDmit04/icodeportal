import {Inter} from "next/font/google"
import '../globals.css'
export const metadata ={
    title : "Portal",
    description : "A Next.js icode Portal Application"
}
const inter = Inter({subsets: ["latin"]})
export default function RootLayout({
    children
} : {
    children : React.ReactNode
}){
    
    
    
    return (

        <html lang="en">
            <body className={`${inter.className} bg-dark-3`}>
                {children}
            </body>
        </html>

    );
}