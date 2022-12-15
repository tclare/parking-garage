## Welcome to Parking Garage!


![](https://github.com/tclare/parking-garage/blob/main/assets/demo.gif)


#### 💡 Background

This is a fun little side project of mine for learning React Native. For background: my roommate and I share a car. We always have difficulty remembering which floor the car is parked on (our parking garage has four floors). Thus, the idea for parking garage was born.

#### 📱 Functionality

The app consists of a single screen displaying which floor our car is on, as well as multiple methods for how a user can 'park'. The easier (yet less impressive way) is for the user to click the secondary CTA button, pick a floor P1 through P4 from a bottom sheet, and be on their way. The definitely-not-overkill way is for the user to click the primary CTA button before entering the garage, at which point the phone will auto-detect which floor the user has driven down to, and park the car appropriately, using React Native's DeviceMotion API.

#### 📚 Tech Stack

The frontend of the App is scaffolded using a few basic React Native components.
The current floor the car is parked on is hosted in a private AWS S3 bucket.
The backend functionality for parking the car is provided by an AWS Lambda function, hidden behind an Authorizer.💡
