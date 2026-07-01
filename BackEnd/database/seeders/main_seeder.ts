import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Package from '#models/package'
import Banner from '#models/banner'
import Review from '#models/review'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // 0. Data Admin User
    const adminExists = await User.findBy('email', 'admin@travel.com')
    let adminUser = adminExists
    if (!adminUser) {
      adminUser = await User.create({
        fullName: 'Admin Travel KONG',
        email: 'admin@travel.com',
        password: 'password123',
      })
    }

    const user1Exists = await User.findBy('email', 'budi@gmail.com')
    let user1 = user1Exists
    if (!user1) {
      user1 = await User.create({
        fullName: 'Budi Santoso',
        email: 'budi@gmail.com',
        password: 'password123',
      })
    }

    const user2Exists = await User.findBy('email', 'siti@gmail.com')
    let user2 = user2Exists
    if (!user2) {
      user2 = await User.create({
        fullName: 'Siti Rahma',
        email: 'siti@gmail.com',
        password: 'password123',
      })
    }

    // 1. Data Dummy Packages
    await Package.createMany([
      // Bus (3 items)
      { name: 'Bus Eksekutif Bandung-Jogja', image: 'jogja.jpg', description: 'Perjalanan nyaman dengan kursi reclining dan fasilitas makan malam.', price: '250000', transportType: 'bus', provider: 'Sinar Jaya', origin: 'Bandung', destination: 'Jogja', rating: 4.6 },
      { name: 'Bus VIP Bandung-Bali', image: 'bali.jpg', description: 'Nikmati perjalanan panjang melintasi Jawa-Bali dengan bus premium dan tiket kapal laut.', price: '650000', transportType: 'bus', provider: 'Gunung Harta', origin: 'Bandung', destination: 'Bali', rating: 4.8 },
      { name: 'Bus AC Patas Bandung-Lombok', image: 'lombok.jpg', description: 'Perjalanan darat plus kapal ferry menuju Lombok dengan fasilitas nyaman.', price: '850000', transportType: 'bus', provider: 'Safari Dharma Raya', origin: 'Bandung', destination: 'Lombok', rating: 4.5 },
      
      // Travel (3 items)
      { name: 'Shuttle Travel Bandung-Jogja', image: 'jogja.jpg', description: 'Layanan door-to-door cepat via tol trans Jawa.', price: '350000', transportType: 'travel', provider: 'Daytrans', origin: 'Bandung', destination: 'Jogja', rating: 4.7 },
      { name: 'Travel Bandung-Bali VIP', image: 'bali.jpg', description: 'Layanan travel eksklusif dengan kapasitas 8 orang.', price: '850000', transportType: 'travel', provider: 'Baraya Travel', origin: 'Bandung', destination: 'Bali', rating: 4.6 },
      { name: 'Travel Cepat Bandung-Lombok', image: 'lombok.jpg', description: 'Paket travel darat plus penyeberangan aman ke Lombok.', price: '1200000', transportType: 'travel', provider: 'Lintas Nusantara', origin: 'Bandung', destination: 'Lombok', rating: 4.4 },

      // Pesawat (3 items)
      { name: 'Tiket Pesawat BDO-YIA', image: 'jogja.jpg', description: 'Penerbangan langsung dari Husein Sastranegara/Kertajati ke Yogyakarta.', price: '1100000', transportType: 'pesawat', provider: 'Citilink', origin: 'Bandung', destination: 'Jogja', rating: 4.9 },
      { name: 'Tiket Pesawat BDO-DPS', image: 'bali.jpg', description: 'Terbang nyaman ke Bali dalam hitungan jam.', price: '1500000', transportType: 'pesawat', provider: 'Garuda Indonesia', origin: 'Bandung', destination: 'Bali', rating: 5.0 },
      { name: 'Tiket Pesawat BDO-LOP', image: 'lombok.jpg', description: 'Penerbangan ke Lombok dengan transit yang efisien.', price: '1800000', transportType: 'pesawat', provider: 'Lion Air', origin: 'Bandung', destination: 'Lombok', rating: 4.3 },

      // Kereta (3 items)
      { name: 'Kereta Argo Wilis BD-YK', image: 'jogja.jpg', description: 'Nikmati pemandangan indah jalur selatan menggunakan kereta kelas Eksekutif.', price: '450000', transportType: 'kereta', provider: 'KAI', origin: 'Bandung', destination: 'Jogja', rating: 4.8 },
      { name: 'Kereta Turangga BD-SGU (Transit Bali)', image: 'bali.jpg', description: 'Perjalanan ke Surabaya Gubeng, dilanjutkan bus ke Bali (paket integrasi).', price: '750000', transportType: 'kereta', provider: 'KAI', origin: 'Bandung', destination: 'Bali', rating: 4.7 },
      { name: 'Kereta Mutiara Selatan (Transit Lombok)', image: 'lombok.jpg', description: 'Kereta nyaman ke ujung timur Jawa, dilanjutkan ferry ke Lombok.', price: '950000', transportType: 'kereta', provider: 'KAI', origin: 'Bandung', destination: 'Lombok', rating: 4.5 }
    ])

    // 2. Data Dummy Banners
    await Banner.createMany([
      {
        title: 'Diskon Liburan Musim Panas hingga 30%!',
        image: 'banner-promo.jpg',
      }
    ])

    // 3. Data Dummy Reviews
    await Review.createMany([
      {
        packageId: 1, // Asumsi ID 1 (Bus Eksekutif)
        userId: user1.id,
        customerName: 'Budi Santoso',
        reviewText: 'Pelayanannya top banget! Hotel bersih, tour guide ramah, sangat direkomendasikan.',
        rating: 5,
      },
      {
        packageId: 2, // Asumsi ID 2 (Bus VIP Bali)
        userId: user2.id,
        customerName: 'Siti Rahma',
        reviewText: 'Liburan ke Bali jadi gak ribet, semua diurus dengan rapi sama Travel Agent ini.',
        rating: 4,
      }
    ])
  }
}