import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Package from '#models/package'
import Banner from '#models/banner'
import Review from '#models/review'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // 0. Data Admin User
    const adminExists = await User.findBy('email', 'admin@travel.com')
    if (!adminExists) {
      await User.create({
        fullName: 'Admin Travel KONG',
        email: 'admin@travel.com',
        password: 'password123',
      })
    }

    // 1. Data Dummy Packages
    await Package.createMany([
      {
        name: 'Paket Wisata Bali Exotic 3D2N',
        image: 'bali.jpg',
        description: 'Nikmati keindahan pantai Kuta, Tanah Lot, dan budaya Ubud yang memukau.',
        price: '2500000',
      },
      {
        name: 'Eksplorasi Lombok Mandalika',
        image: 'lombok.jpg',
        description: 'Kunjungi sirkuit internasional Mandalika dan indahnya Gili Trawangan.',
        price: '3200000',
      },
      {
        name: 'Trip Sejarah Yogyakarta',
        image: 'jogja.jpg',
        description: 'Liburan seru ke Candi Borobudur, Prambanan, dan belanja di Malioboro.',
        price: '1800000',
      }
    ])

    // 2. Data Dummy Banners
    await Banner.createMany([
      {
        title: 'Diskon Liburan Musim Panas hingga 30%!',
        image: 'banner-promo.jpg',
      },
      {
        title: 'Jelajahi Keindahan Nusantara Bersama Kami',
        image: 'banner-hero.jpg',
      }
    ])

    // 3. Data Dummy Reviews
    await Review.createMany([
      {
        customerName: 'Budi Santoso',
        reviewText: 'Pelayanannya top banget! Hotel bersih, tour guide ramah, sangat direkomendasikan.',
        rating: 5,
      },
      {
        customerName: 'Siti Rahma',
        reviewText: 'Liburan ke Bali jadi gak ribet, semua diurus dengan rapi sama Travel Agent ini.',
        rating: 4,
      }
    ])
  }
}