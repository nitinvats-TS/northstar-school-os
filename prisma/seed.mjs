import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const users = [
  ["admin@northstar.edu", "admin123", Role.SUPER_ADMIN],
  ["director@northstar.edu", "director123", Role.DIRECTOR],
  ["office@northstar.edu", "office123", Role.FRONT_OFFICE],
  ["teacher@northstar.edu", "teacher123", Role.TEACHER],
  ["student@northstar.edu", "student123", Role.STUDENT],
  ["parent@northstar.edu", "parent123", Role.PARENT],
];

const students = [
  ["ST001", "Aarav", "Mehta", "8", "A", "9876543210", "aarav.mehta@email.com"],
  ["ST002", "Riya", "Kapoor", "10", "B", "9876543211", "riya.kapoor@email.com"],
  ["ST003", "Kabir", "Shah", "6", "C", "9876543212", "kabir.shah@email.com"],
  ["ST004", "Myra", "Joseph", "9", "A", "9876543213", "myra.joseph@email.com"],
];

const teachers = [
  ["TC021", "Vikram", "Singh", "Mathematics", "9876543201", "vikram.singh@northstar.edu"],
  ["TC034", "Ishita", "Verma", "English Literature", "9876543202", "ishita.verma@northstar.edu"],
  ["TC012", "Dev", "Malhotra", "Physics", "9876543203", "dev.malhotra@northstar.edu"],
  ["TC045", "Sana", "Khan", "Social Studies", "9876543204", "sana.khan@northstar.edu"],
];

const parents = [
  ["Nisha", "Mehta", "9876543101", "nisha.mehta@email.com"],
  ["Sanjay", "Kapoor", "9876543102", "sanjay.kapoor@email.com"],
  ["Meera", "Shah", "9876543103", "meera.shah@email.com"],
  ["Anil", "Joseph", "9876543104", "anil.joseph@email.com"],
];

async function main() {
  for (const [email, password, role] of users) {
    await prisma.user.upsert({ where: { email }, update: { password, role }, create: { email, password, role } });
  }
  for (const [admissionNo, firstName, lastName, className, section, phone, email] of students) {
    await prisma.student.upsert({ where: { admissionNo }, update: { firstName, lastName, className, section, phone, email }, create: { admissionNo, firstName, lastName, className, section, phone, email } });
  }
  for (const [employeeId, firstName, lastName, subject, phone, email] of teachers) {
    await prisma.teacher.upsert({ where: { employeeId }, update: { firstName, lastName, subject, phone, email }, create: { employeeId, firstName, lastName, subject, phone, email } });
  }
  for (const [firstName, lastName, phone, email] of parents) {
    await prisma.parent.upsert({ where: { email }, update: { firstName, lastName, phone }, create: { firstName, lastName, phone, email } });
  }
  console.log("Seeded Northstar demo users, students, teachers, and parents.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
