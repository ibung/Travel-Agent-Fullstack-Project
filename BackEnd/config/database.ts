import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  /**
   * Default connection used for all queries.
   */
  connection: 'mysql', // <--- INI KUNCI UTAMANYA: Ubah ke mysql

  connections: {
    /**
     * SQLite connection (default).
     */
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      schemaGeneration: {
        enabled: true,
        rulesPaths: ['./database/schema_rules.js'],
      },
    },

    /**
     * MySQL / MariaDB connection.
     * Install package to switch: npm install mysql2
     */
    mysql: {
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        port: 3307,
        user: 'root',
        password: '',
        database: 'travel_agent_db',
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: false,
    },

    /**
     * PostgreSQL connection.
     */
    // pg: {
    //   client: 'pg',
    // ... (dibiarkan comment saja)
    // },

    // mssql: { ... },
    // libsql: { ... }
  },
})

export default dbConfig