import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const client = new S3Client({ region: 'us-east-1' });

export async function putCarFloor(event) {
  const carFloor = event.body;
  if (!carFloor || !["P1", "P2", "P3", "P4"].includes(carFloor)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          success: false,
          message: 'Invalid car floor specified in body.'
        }
      )
    }
  }
  
  const command = new PutObjectCommand({ 
    Bucket: process.env.CAR_PARK_S3_BUCKET,
    Key: process.env.CAR_PARK_S3_KEY,
    Body: carFloor
  });

  await client.send(command);

  return {
    headers: { 'Content-Type': 'application/json' },
    statusCode: 200,
    body: JSON.stringify({ success: true }, null, 2)
  };
};
