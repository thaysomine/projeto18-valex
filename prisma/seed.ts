import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
	const companies = [
		{
			name: "Driven",
			apiKey: "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0",
		},
	]

	const employees = [
		{
			fullName: "Lucax da Turma7",
			cpf: "47100935741",
			email: "lucax.daT7@gmail.com",
			companyId: 1,
		},
		{
			fullName: "Thay bebe omine",
			cpf: "08434681895",
			email: "ThaybbOmine@gmail.com",
			companyId: 1,
		},
	]

	const businesses = [
		{
			name: "Responde Aí",
			type: "education" as const,
		},
		{
			name: "Extra",
			type: "groceries" as const,
		},
		{
			name: "Driven Eats",
			type: "restaurant" as const,
		},
		{
			name: "Uber",
			type: "transport" as const,
		},
		{
			name: "Unimed",
			type: "health" as const,
		},
	]

	await prisma.companies.createMany({ data: companies })
	await prisma.employees.createMany({ data: employees })
	await prisma.businesses.createMany({ data: businesses })
}

main()
	.catch(e => {
		console.error(e)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
