import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Package extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare image: string

    @column()
    declare description: string

    @column()
    declare price: string

    @column()
    declare transportType: string

    @column()
    declare provider: string

    @column()
    declare origin: string

    @column()
    declare destination: string

    @column()
    declare rating: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}