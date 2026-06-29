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

// Endpoint API untuk FrontEnd Nuxt
router.get('/api/travel-data', [controllers.TravelApis, 'index'])

// Endpoint manajemen paket (Full CRUD)
router.post('/api/packages', [TravelApisController, 'store'])
router.put('/api/packages/:id', [TravelApisController, 'update'])
router.delete('/api/packages/:id', [TravelApisController, 'destroy'])

// Endpoint manajemen banner (Full CRUD)
router.post('/api/banners', [TravelApisController, 'storeBanner'])
router.put('/api/banners/:id', [TravelApisController, 'updateBanner'])
router.delete('/api/banners/:id', [TravelApisController, 'destroyBanner'])

// Endpoint manajemen review (Hanya Read dan Delete)
router.delete('/api/reviews/:id', [TravelApisController, 'destroyReview'])