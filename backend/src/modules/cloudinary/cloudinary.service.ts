import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    console.log('Cloudinary Config:', { cloudName, apiKey, apiSecret: apiSecret ? '***' : undefined });
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'snec-task' },
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve(result);
          else reject(new Error('Unknown upload error'));
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'snec-task-attachments', resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve(result);
          else reject(new Error('Unknown upload error'));
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }
}
