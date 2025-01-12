import { GoneException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary'

@Injectable()
export class FileUploadService {
    constructor(
        private readonly configService: ConfigService
    ) {
        v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET')
        })
    }

    async upload(file: Express.Multer.File, options?: UploadApiOptions) {
        const uploadResult = await new Promise<UploadApiResponse>(
            (resolve, reject) => {
                const cloudinaryStream = v2.uploader.upload_stream(
                    { resource_type: 'auto', ...options }, (err, result) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        }

                        resolve(result as UploadApiResponse);
                    },
                )

                cloudinaryStream.end(file.buffer)
            }
        )

        return uploadResult
    }

    async deleteFile(fileUrl: string) {
        const publicId = fileUrl.split('/').pop().split('.')[0];

        const deleteResult = await v2.uploader.destroy(publicId).catch(
            () => {
                throw new GoneException('failed to delete avatar') 
            }
        )

        return deleteResult
    }
}
