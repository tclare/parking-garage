import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const client = new S3Client({ region: 'us-east-1' });

export async function getCarFloor() {
  
  const command = new GetObjectCommand({
    Bucket: process.env.CAR_PARK_S3_BUCKET,
    Key: process.env.CAR_PARK_S3_KEY
  });

  const getObjectResponse = await client.send(command); 
  const carFloor = await streamToString(getObjectResponse?.Body);
  const lastParked = summarizeLastModified(getObjectResponse.LastModified);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        success: true,
        floor: carFloor,
        lastParked
      },
      null,
      2
    ),
  };
};


const streamToString = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on("data", (chunk) => chunks.push(chunk));
  stream.on("error", reject);
  stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});

const summarizeLastModified = (lastModifiedDate) => {
  const currentSeconds = Math.floor(new Date().getTime() / 1000);
  const lastModifiedSeconds = Math.floor(lastModifiedDate.getTime() / 1000);
  const delta = currentSeconds - lastModifiedSeconds;
  for (let pair of relativeDateTable) {
    const [durationAbbreviation, durationInterval] = pair;
    const numIntervals = Math.floor(delta / durationInterval);
    if (numIntervals > 0) return `${numIntervals}${durationAbbreviation} ago`
  }
  return 'now';
}

const relativeDateTable = [
  ['y', 31536000],
  ['w', 604800],
  ['d', 86400],
  ['h', 3600],
  ['m', 60],
  ['s', 1]
]