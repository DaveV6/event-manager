import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany({});

  const eventTypes = ['Conference', 'Workshop', 'Meetup', 'Webinar', 'Party'];

  const events = Array.from({ length: 15 }).map((_, i) => {
    const randomDaysToAdd = Math.floor(Math.random() * 180);
    const randomHours = Math.floor(Math.random() * 24);
    
    // Create a new date object for the current date
    const fromDate = new Date();
    
    // Add random days and hours to the current date
    fromDate.setDate(fromDate.getDate() + randomDaysToAdd);
    fromDate.setHours(fromDate.getHours() + randomHours);
    
    const durationHours = Math.floor(Math.random() * 4) + 1;
    
    // Create a new date object for the end date
    const toDate = new Date(fromDate);
    toDate.setHours(toDate.getHours() + durationHours);
    
    return {
      name: `${eventTypes[Math.floor(Math.random() * eventTypes.length)]} ${i + 1}`,
      desc: `This is a description for event ${i + 1}. Join us for this exciting event!`,
      from: fromDate,
      to: toDate,
    };
  });

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log('Seeded 15 random events');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
