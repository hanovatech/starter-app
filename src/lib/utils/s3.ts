import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3_ENDPOINT_URL,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_ACCESS_KEY_SECRET,
  S3_BUCKET_NAME
} from '$env/static/private';

const s3Client = new S3Client({
  endpoint: S3_ENDPOINT_URL,
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_ACCESS_KEY_SECRET
  }
});

export default s3Client;
export { S3_BUCKET_NAME };

export async function getPresignedUrl(
  key: string,
  expiresIn = 3600,
  commandOptions?: Record<string, string | undefined>
): Promise<string> {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ...commandOptions
    }),
    { expiresIn }
  );
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  return getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType
    }),
    { expiresIn }
  );
}

export async function getObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key
  });
  return s3Client.send(command);
}

export async function headObject(key: string) {
  const command = new HeadObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key
  });
  return s3Client.send(command);
}
