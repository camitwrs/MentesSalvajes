import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';


const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY;
const R2_SECRET_KEY = process.env.R2_SECRET_KEY;
const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID; // ¡Asegúrate de que esta variable exista en tu .env!
const R2_PUBLIC_BASE_URL= process.env.R2_PUBLIC_BASE_URL;

// Endpoint para el cliente S3 (usa el Account ID)
const R2_S3_ENDPOINT = `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// URL base para acceder a los archivos públicamente (Endpoint + Bucket Name)
const PUBLIC_R2_BASE_URL = `${R2_S3_ENDPOINT}/${R2_BUCKET_NAME}`;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

export const uploadFileToR2 = async (fileBuffer, fileName, contentType) => {
  const params = {
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read', // Permite el acceso público a la URL generada
  };

  try {
    const uploader = new Upload({
      client: s3Client,
      params: params,
    });
    await uploader.done();
    const publicUrl = `${R2_PUBLIC_BASE_URL}/${fileName}`;
    console.log(`Archivo subido exitosamente a R2: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error al subir archivo a Cloudflare R2:', error);
    throw new Error(`Fallo al subir el archivo ${fileName} a R2: ${error.message}`);
  }
};

export const deleteFileFromR2 = async (fileName) => {
  const params = {
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`Archivo ${fileName} eliminado exitosamente de R2.`);
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de Cloudflare R2:', error);
    throw new Error(`Fallo al eliminar el archivo ${fileName} de R2: ${error.message}`);
  }
};