import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const sellerPassword = await bcrypt.hash('seller123', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin User',
      username: 'admin',
      passwordHash: adminPassword,
      role: 'manager',
    },
  })

  const seller = await prisma.user.upsert({
    where: { username: 'ali' },
    update: {},
    create: {
      name: 'Ali Seller',
      username: 'ali',
      passwordHash: sellerPassword,
      role: 'seller',
    },
  })

  console.log('Users created:', { admin: admin.id, seller: seller.id })

  // Create sample products
  const product1 = await prisma.product.upsert({
    where: { name: 'Begavod Armatura 12' },
    update: {},
    create: {
      name: 'Begavod Armatura 12',
      category: 'Armatura',
      unit: 'm',
      type: 'armatura',
      diameterMm: 12,
      brand: 'Begavod',
    },
  })

  const product2 = await prisma.product.upsert({
    where: { name: 'Begavod Armatura 14' },
    update: {},
    create: {
      name: 'Begavod Armatura 14',
      category: 'Armatura',
      unit: 'm',
      type: 'armatura',
      diameterMm: 14,
      brand: 'Begavod',
    },
  })

  const product3 = await prisma.product.upsert({
    where: { name: 'Cement Bag 50kg' },
    update: {},
    create: {
      name: 'Cement Bag 50kg',
      category: 'Materials',
      unit: 'pcs',
      type: 'product',
    },
  })

  console.log('Products created:', [product1.id, product2.id, product3.id])

  // Create pricing rules
  await prisma.pricingRule.upsert({
    where: { productId: product1.id },
    update: {},
    create: {
      productId: product1.id,
      minimalPricePerUnit: 8000,
      recommendedPricePerUnit: 10000,
    },
  })

  await prisma.pricingRule.upsert({
    where: { productId: product2.id },
    update: {},
    create: {
      productId: product2.id,
      minimalPricePerUnit: 9000,
      recommendedPricePerUnit: 11000,
    },
  })

  await prisma.pricingRule.upsert({
    where: { productId: product3.id },
    update: {},
    create: {
      productId: product3.id,
      minimalPricePerUnit: 50000,
      recommendedPricePerUnit: 65000,
    },
  })

  console.log('Pricing rules created')

  // Create sample purchases
  const purchase1 = await prisma.purchase.create({
    data: {
      productId: product1.id,
      qtyIn: 1000,
      buyPricePerUnit: 7500,
      expenseTotal: 0,
      arrivedAt: new Date(),
      note: 'First batch',
    },
  })

  const purchase2 = await prisma.purchase.create({
    data: {
      productId: product3.id,
      qtyIn: 500,
      buyPricePerUnit: 45000,
      expenseTotal: 0,
      arrivedAt: new Date(),
      note: 'Cement delivery',
    },
  })

  console.log('Purchases created:', [purchase1.id, purchase2.id])

  // Create sample sale
  const sale = await prisma.sale.create({
    data: {
      sellerId: seller.id,
      soldAt: new Date(),
      customerName: 'Test Customer',
      paymentType: 'cash',
      totalSum: 500000,
      totalProfit: 50000,
      saleItems: {
        create: [
          {
            productId: product1.id,
            qty: 50,
            sellPricePerUnit: 9500,
            costPricePerUnitSnapshot: 7500,
            lineTotal: 475000,
            lineProfit: 100000,
          },
        ],
      },
    },
  })

  console.log('Sale created:', sale.id)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
