import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import { Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

const Contact = () => {

    return (
        <div className="min-h-[855px] bg-gradient-to-b from-blue-900 to-blue-700 text-white">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
                
                <div className="grid grid-cols-2 gap-12">
                    <GetInTouch />

                    <div className="space-y-8">
                        <Card className="bg-white ">
                            <CardHeader>
                                <CardTitle className="text-blue-900">
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    <Phone className="mr-2 h-5 w-5 text-blue-900" />
                                    <span>+63 2 8123 4567</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="mr-2 h-5 w-5 text-blue-900" />
                                    <span>contact@digivote.ph</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-5 w-5 text-blue-900" />
                                    <span>123 Ayala Avenue, Makati City, Metro Manila, Philippines</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white text-blue-900 h-[400px]">
                            <CardHeader>
                                <CardTitle>
                                    Our Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2055.9318922448497!2d120.95000612968748!3d14.82203293287884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ac532a81015b%3A0xc6d68046c20168c!2sChurch!5e1!3m2!1sen!2sph!4v1738240660544!5m2!1sen!2sph" 
                                className="border-0 w-full h-[300px] rounded-lg" loading="lazy" ></iframe>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

type MessageFormState = {
    name: string,
    email: string,
    message: string,
}

const GetInTouch = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<MessageFormState>()

    const onSubmit:SubmitHandler<MessageFormState> = async (data) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.post('/user/getInTouch', data)

            if(response.status === 400) {
                setError(response.data.name, {
                    type: 'manual',
                    message: response.data.message
                })
                return
            }

            if(response.status >= 401) {
                throw new Error(response.data.message)
            }

            reset({
                'email': '',
                'message': '',
                'name': ''
            })
            toast.success(response.data.message)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Card className="bg-white min-h-[458px]">
            <CardHeader>
                <CardTitle>
                    Get in Touch
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>   
                        <Label htmlFor="name" className="block mb-2">
                            Name
                        </Label>
                        <Input {...register('name', {
                            required: 'Name is required for identification'
                        })} id="name" placeholder="Your Name" />
                        {errors.name && <span className="text-red-600">{errors.name.message}</span>}
                    </div>
                    <div>
                        <Label htmlFor="email" className="block mb-2">
                            Email
                        </Label>
                        <Input {...register('email', {
                            required: 'Email is required for contacting you.',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
                                message: 'Invalid email'
                            }
                        })} id="email" type="email" placeholder="your@email.com" />
                        {errors.email && <span className="text-red-600">{errors.email.message}</span>}
                    </div>
                    <div>
                        <Label htmlFor="message" className="block mb-2">
                            Message
                        </Label>
                        <Textarea {...register('message', {
                            required: 'Message is required!',
                            minLength: {
                                value: 20,
                                message: "message should have a minimum of 20 characters",
                            },
                        })} id="message" placeholder="Your message here..." className="h-[300px] max-h-[400px]" />
                        {errors.message && <span className="text-red-600">{errors.message.message}</span>}
                    </div>
                    <Button type="submit" className="w-full">
                        {isLoading ? <LoadingSpinner /> :"Send Message"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default Contact