import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import CreateFaq from "./CreateFaq"
import FaqOption from "./FaqOption"
import { faq } from "@/types/faq"
import { useAuthContext } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import axiosFetch from "@/lib/axios"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/common/LoadingSpinner"

const ShowFaqs = () => {
    const { user } = useAuthContext()
    
    const { data:faqs, isLoading }  = useQuery({
        queryKey: ['faqs'],
        queryFn: async () => {
            const response = await axiosFetch.get('/faqs')
            
            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }

            return response.data as faq[]
        },
        refetchOnWindowFocus: false,
    })

    if(isLoading) {
        return <LoadingSpinner />
    }

    return (
        <Card>
            <CardHeader className="flex-row justify-between">
                <CardTitle>Frequenly Asked Questions</CardTitle>
                {user.role === 'admin' && (
                    <CreateFaq />
                )}
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible>
                    {faqs?.map((faq: faq, index: any) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="flex-row">
                                <div className="flex items-center">
                                    {user.role === 'admin' && (
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <FaqOption  id={faq.id} initialData={{
                                                question: faq.question,
                                                answer: faq.answer,
                                            }} />
                                        </div> 
                                    )}
                                    {faq.question}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}

export default ShowFaqs