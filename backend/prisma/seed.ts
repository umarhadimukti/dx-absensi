import 'dotenv/config';
import { PrismaClient, Role } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedUsers() {
  const users = [
    {
      email: 'admin@dexa.test',
      password: '$2a$10$.DuyNvER0etG94JaLVpRlup2ljPqUHQMLKOHg.gaxf1sebM5uPkUK',
      role: Role.ADMIN,
      is_active: true,
    },
    {
      email: 'hr@dexa.test',
      password: '$2a$10$RsTFuVhDH5eivjDF47zW4.Y/9lCljgWwWroTL6PwGo8DaCpivztG6',
      role: Role.HR,
      is_active: true,
    },
    {
      email: 'karyawan@dexa.test',
      password: '$2a$10$smNLnBbzqhEU7ksxgDyzTeY0LW6QNlVmcpVMiS/JrkKIwcUgy8E7O',
      role: Role.KARYAWAN,
      is_active: true,
    },
  ]

  for (const user of users) {
    await prisma.users.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    })
  }
}

async function seedMasterShift() {
  const shifts = [
    {
      nama_shift: 'WFO1',
      jam_masuk: '08:00',
      jam_keluar: '17:00',
      toleransi: 15,
    },
    {
      nama_shift: 'WFO2',
      jam_masuk: '13:00',
      jam_keluar: '22:00',
      toleransi: 15,
    },
    {
      nama_shift: 'WFH1',
      jam_masuk: '08:00',
      jam_keluar: '17:00',
      toleransi: 15,
    },
    {
      nama_shift: 'WFH2',
      jam_masuk: '13:00',
      jam_keluar: '22:00',
      toleransi: 15,
    },
    {
      nama_shift: 'Libur',
      jam_masuk: '00:00',
      jam_keluar: '00:00',
      toleransi: 0,
    },
  ];

  for (const shift of shifts) {
    await prisma.dexa_master_shifts.upsert({
      where: { nama_shift: shift.nama_shift },
      update: shift,
      create: shift,
    });
    console.log(`Seeded shift: ${shift.nama_shift}`);
  }
}

async function seedPegawai() {
  const pegawaiData = [
    {
      email: 'admin@dexa.test',
      nip: 'ADM001',
      nama: 'Admin Dexa',
      departemen: 'IT',
      jabatan: 'System Administrator',
      no_telepon: '081200000001',
      tanggal_masuk: new Date('2020-01-01'),
    },
    {
      email: 'hr@dexa.test',
      nip: 'HR001',
      nama: 'HR Dexa',
      departemen: 'Human Resource',
      jabatan: 'HR Manager',
      no_telepon: '081200000002',
      tanggal_masuk: new Date('2020-01-01'),
    },
    {
      email: 'karyawan@dexa.test',
      nip: 'KRY001',
      nama: 'Karyawan Dexa',
      departemen: 'Operasional',
      jabatan: 'Staff',
      no_telepon: '081200000003',
      tanggal_masuk: new Date('2021-06-01'),
    },
  ];

  for (const data of pegawaiData) {
    const user = await prisma.users.findUnique({ where: { email: data.email } });
    if (!user) {
      console.log(`User not found for ${data.email}, skipping pegawai seed.`);
      continue;
    }

    const { email, ...pegawai } = data;
    await prisma.dexa_pegawai.upsert({
      where: { nip: pegawai.nip },
      update: pegawai,
      create: { ...pegawai, user_id: user.id },
    });
    console.log(`Seeded pegawai: ${pegawai.nama}`);
  }
}

async function main() {
  await seedUsers();
  await seedPegawai();
  await seedMasterShift();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
