# Event Manager App
This is a simple app for managing events. The app was created for a job interview.

## Prerequisites
`node >= 18`

## Installation

### Install dependencies
```
npm i --legacy-peer-deps
```
Note: The reason for using `--legacy-peer-deps` is because of the library `react-day-picker` which breaks the shadcn calendar in the latest version

### Set up the database
```
npx prisma migrate dev --name init
npx prisma generate
```

### Seed the database with sample data
```
npm run seed
```

## Running the client

```
npm run dev
```

## Running the server

```
npm run server
```
