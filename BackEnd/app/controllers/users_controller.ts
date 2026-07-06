import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.query().orderBy('createdAt', 'desc')
    return response.ok({
      data: users.map((user) => user.serialize()),
    })
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    const user = await User.create(data)
    
    return response.created({
      message: 'User created successfully',
      data: user.serialize(),
    })
  }

  async update({ request, params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['fullName', 'email', 'password'])
    
    // Only update password if provided
    if (data.password) {
      user.password = data.password
    }
    if (data.fullName) {
      user.fullName = data.fullName
    }
    if (data.email) {
      user.email = data.email
    }
    
    await user.save()

    return response.ok({
      message: 'User updated successfully',
      data: user.serialize(),
    })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.ok({
      message: 'User deleted successfully',
    })
  }
}
