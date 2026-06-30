import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'packages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()        // Nama paket travel
      table.string('image').notNullable()       // Nama file photo/gambar paket 
      table.text('description').notNullable()   // Deskripsi lengkap paket 
      table.decimal('price', 12, 2).notNullable() // Harga paket 
      
      table.string('transport_type').notNullable().defaultTo('bus') // bus, travel, pesawat, kereta
      table.string('provider').notNullable().defaultTo('KONG Travel')
      table.string('origin').notNullable().defaultTo('Bandung')
      table.string('destination').notNullable().defaultTo('Jogja')
      table.decimal('rating', 3, 1).notNullable().defaultTo(4.5)

      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}