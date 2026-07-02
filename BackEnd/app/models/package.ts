import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Review from './review.js'

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

    @column({ columnName: 'transport_type' })
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

    @hasMany(() => Review)
    declare reviews: HasMany<typeof Review>
}