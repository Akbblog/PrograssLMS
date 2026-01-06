const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding transport and document template examples...');

  // Create sample vehicle
  const vehicle = await prisma.vehicle.upsert({
    where: { id: 'vehicle-sample-1' },
    update: {},
    create: {
      id: 'vehicle-sample-1',
      registration: 'REG-TR-1001',
      make: 'Toyota',
      model: 'Coaster',
      capacity: 30,
      driver: 'driver-sample-1',
      schoolId: 'school-sample-1'
    }
  });

  console.log('Vehicle:', vehicle.id);

  // Create sample route
  const route = await prisma.route.upsert({
    where: { id: 'route-sample-1' },
    update: {},
    create: {
      id: 'route-sample-1',
      name: 'North Campus Loop',
      stops: JSON.stringify(['Gate A','Stop 1','Stop 2','Campus']),
      vehicleId: vehicle.id,
      schoolId: 'school-sample-1'
    }
  });

  console.log('Route:', route.id);

  // Create sample allocation
  const allocation = await prisma.transportAllocation.upsert({
    where: { id: 'alloc-sample-1' },
    update: {},
    create: {
      id: 'alloc-sample-1',
      studentId: 'student-sample-1',
      routeId: route.id,
      vehicleAssignedId: vehicle.id,
      pickupPoint: 'Stop 1',
      dropPoint: 'Campus',
      schoolId: 'school-sample-1'
    }
  });

  console.log('Allocation:', allocation.id);

  // Create sample driver attendance
  const attendance = await prisma.driverAttendance.upsert({
    where: { id: 'driver-att-1' },
    update: {},
    create: {
      id: 'driver-att-1',
      driverId: 'driver-sample-1',
      vehicleId: vehicle.id,
      routeId: route.id,
      date: new Date(),
      schoolId: 'school-sample-1'
    }
  });

  console.log('DriverAttendance:', attendance.id);

  // Create sample document template
  const doc = await prisma.documentTemplate.upsert({
    where: { id: 'doc-tpl-1' },
    update: {},
    create: {
      id: 'doc-tpl-1',
      name: 'Fee Voucher',
      type: 'feeVoucher',
      template: '<div>Fee voucher template</div>',
      schoolId: 'school-sample-1'
    }
  });

  console.log('DocumentTemplate:', doc.id);

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
