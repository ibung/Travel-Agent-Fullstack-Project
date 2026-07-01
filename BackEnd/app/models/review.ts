import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Package from './package.js'
import User from './user.js'

export default class Review extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare packageId: number

    @column()
    declare userId: number

    @column()
    declare customerName: string

    @column()
    declare reviewText: string

    @column()
    declare rating: number | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => Package)
    declare package: BelongsTo<typeof Package>

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>
}