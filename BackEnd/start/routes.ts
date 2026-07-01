/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import TravelApisController from '../app/controllers/travel_apis_controller.js'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router.get('banners', [controllers.TravelApis, 'banners'])
    router.get('packages', [controllers.TravelApis, 'packages'])
    router.get('reviews', [controllers.TravelApis, 'reviews'])

    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')

// Endpoint API untuk FrontEnd Nuxt (public)
router.get('/api/travel-data', [controllers.TravelApis, 'index'])
router.post('/api/reviews', [TravelApisController, 'storeReview']).use(middleware.auth())

// Endpoint manajemen - dilindungi middleware auth (hanya admin terautentikasi)
router
  .group(() => {
    // Manajemen paket (Full CRUD)
    router.post('/packages', [TravelApisController, 'store'])
    router.put('/packages/:id', [TravelApisController, 'update'])
    router.delete('/packages/:id', [TravelApisController, 'destroy'])

    // Manajemen banner (Full CRUD)
    router.post('/banners', [TravelApisController, 'storeBanner'])
    router.put('/banners/:id', [TravelApisController, 'updateBanner'])
    router.delete('/banners/:id', [TravelApisController, 'destroyBanner'])

    // Manajemen review (Hanya Delete)
    router.delete('/reviews/:id', [TravelApisController, 'destroyReview'])

    // Mendapatkan daftar gambar di folder public FrontEnd
    router.get('/images', [TravelApisController, 'getPublicImages'])
  })
  .prefix('/api')
  .use(middleware.auth())