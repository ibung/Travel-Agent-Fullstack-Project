import type { HttpContext } from '@adonisjs/core/http'
import Package from '../models/package.js'
import Banner from '../models/banner.js'
import Review from '../models/review.js'

export default class TravelApisController {
  // Fungsi index lama tetap dipertahankan untuk mengambil semua data
  async index({ response }: HttpContext) {
    const banners = await Banner.all()
    const packages = await Package.all()
    const reviews = await Review.all()

    return response.ok({
      data: { banners, packages, reviews },
    })
  }

  // ================= KELOLA PAKET =================
  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'image', 'description', 'price'])
    const newPackage = await Package.create(data)
    return response.created({ message: 'Paket berhasil ditambahkan', data: newPackage })
  }

  async destroy({ params, response }: HttpContext) {
    const pkg = await Package.findOrFail(params.id)
    await pkg.delete()
    return response.ok({ message: 'Paket berhasil dihapus' })
  }

  // ================= KELOLA BANNER =================
  async storeBanner({ request, response }: HttpContext) {
    const data = request.only(['title', 'image'])
    const newBanner = await Banner.create(data)
    return response.created({ message: 'Banner berhasil ditambahkan', data: newBanner })
  }

  async destroyBanner({ params, response }: HttpContext) {
    const banner = await Banner.findOrFail(params.id)
    await banner.delete()
    return response.ok({ message: 'Banner berhasil dihapus' })
  }

  // ================= KELOLA REVIEWS =================
  async storeReview({ request, response }: HttpContext) {
    const data = request.only(['customerName', 'reviewText', 'rating'])
    const newReview = await Review.create(data)
    return response.created({ message: 'Review berhasil ditambahkan', data: newReview })
  }

  async destroyReview({ params, response }: HttpContext) {
    const review = await Review.findOrFail(params.id)
    await review.delete()
    return response.ok({ message: 'Review berhasil dihapus' })
  }

  // Tambahkan fungsi ini di dalam class TravelApisController kamu bersama fungsi lainnya

async update({ params, request, response }: HttpContext) {
  const pkg = await Package.findOrFail(params.id)
  const data = request.only(['name', 'image', 'description', 'price'])
  pkg.merge(data)
  await pkg.save()

  return response.ok({
    message: 'Paket berhasil diperbarui',
    data: pkg,
  })
}

async updateBanner({ params, request, response }: HttpContext) {
  const banner = await Banner.findOrFail(params.id)
  const data = request.only(['title', 'image'])
  banner.merge(data)
  await banner.save()

  return response.ok({
    message: 'Banner berhasil diperbarui',
    data: banner,
  })
}
}