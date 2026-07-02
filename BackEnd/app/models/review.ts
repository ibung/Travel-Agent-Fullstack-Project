import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Package from './package.js'
import User from './user.js'

export default class Review extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'package_id' })
    declare packageId: number

    @column({ columnName: 'user_id' })
    declare userId: number

    @column({ columnName: 'customer_name' })
    declare customerName: string

    @column({ columnName: 'review_text' })
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