import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('customer_name').notNullable() // Nama customer
      table.text('review_text').notNullable()    // Isi review/testimoni 
      table.integer('rating').nullable()         // Rating bintang (opsional, misal 1-5)

      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}