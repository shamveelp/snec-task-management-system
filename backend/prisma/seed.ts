import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Create Core Permissions
  const permissions = [
    { name: 'MANAGE_USERS', module: 'Users', description: 'Can create, update, and delete users' },
    { name: 'MANAGE_ROLES', module: 'System', description: 'Can create and modify roles and permissions' },
    { name: 'MANAGE_SYSTEM', module: 'System', description: 'Can access system settings and billing' },
    { name: 'CREATE_PROJECT', module: 'Projects', description: 'Can create new projects' },
    { name: 'DELETE_PROJECT', module: 'Projects', description: 'Can delete projects' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }
  console.log('Permissions seeded.');

  // 2. Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'System administrator with full access to everything.',
    },
  });

  await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Workspace administrator.',
    },
  });

  await prisma.role.upsert({
    where: { name: 'Member' },
    update: {},
    create: {
      name: 'Member',
      description: 'Standard team member.',
    },
  });
  console.log('Roles seeded.');

  // 3. Link Super Admin Role to All Permissions
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log('Super Admin permissions linked.');

  // 4. Create the Default Super Admin User
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const adminPass = process.env.ADMIN_PASS || '';
  const hashedPassword = await bcrypt.hash(adminPass, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      roleId: superAdminRole.id,
      
      password: hashedPassword, 
    },
    create: {
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      status: 'ACTIVE',
      roleId: superAdminRole.id,
    },
  });

  console.log(`Default Super Admin created: ${adminEmail} (password: ${adminPass})`);
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
