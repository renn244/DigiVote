import Profile from "@/components/common/Profile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { handleDragOver, handleDropOver, handleFileChange } from "@/lib/FileInputUtil"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"

type ChangeAvatarProps = {
    profile: string
    name: string
}

const ChangeAvatar = ({
    profile,
    name
}: ChangeAvatarProps) => {
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | string>('');
    const [preview, setPreview] = useState();

    const handleSubmit = async () => {
        if(!file) return toast.error('No File selected!')
        
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await axiosFetch.patch('/user/changeAvatar', formData)

        if(response.status >= 400) {
            toast.error(response.data.message)
            return
        }

        queryClient.invalidateQueries({ queryKey: ['user'] })
        toast.success('Avatar changed successfully')
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Avatar
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <Profile className="h-16 w-16" src={preview || profile} username={name} />
                    <label onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDropOver(e, setFile, setPreview)}   
                    htmlFor="avatarInput" className="w-[400px] h-[150px] bg-muted border border-dashed rounded-lg">
                        <div className="flex flex-col items-center justify-center h-full">
                            <span className="font-semibold text-lg">Drag and drop your avatar here</span>
                            <span className="font-semibold text-lg">or</span>
                            <div className="font-semibold bg-blue-600 px-4 py-1 rounded-lg text-white">
                                Browse
                            </div>
                        </div>
                        <input hidden onChange={(e) => handleFileChange(e, setFile, setPreview)} id="avatarInput" type="file" />
                    </label>
                </div>
                <Button onClick={() => handleSubmit()} className="mt-4 w-full">
                    Save
                </Button>
            </CardContent>
        </Card>
    )
}

export default ChangeAvatar