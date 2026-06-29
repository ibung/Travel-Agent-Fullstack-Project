import Banner from '#models/banner'
import Package from '#models/package'
import Review from '#models/review'
import type { HttpContext } from '@adonisjs/core/http'

export default class TravelApisController {
  async index({ serialize }: HttpContext) {
    const banners = await Banner.all()
    const packages = await Package.all()
    const reviews = await Review.all()

    return serialize({
      banners,
      packages,
      reviews,
    })
  }

  async banners({ serialize }: HttpContext) {
    const banners = await Banner.all()
    return serialize(banners)
  }

  async packages({ serialize }: HttpContext) {
    const packages = await Package.all()
    return serialize(packages)
  }

  async reviews({ serialize }: HttpContext) {
    const reviews = await Review.all()
    return serialize(reviews)
  }
}