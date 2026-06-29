/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  travelApis: {
    banners: typeof routes['travel_apis.banners']
    packages: typeof routes['travel_apis.packages']
    reviews: typeof routes['travel_apis.reviews']
    index: typeof routes['travel_apis.index']
    storeReview: typeof routes['travel_apis.store_review']
    store: typeof routes['travel_apis.store']
    update: typeof routes['travel_apis.update']
    destroy: typeof routes['travel_apis.destroy']
    storeBanner: typeof routes['travel_apis.store_banner']
    updateBanner: typeof routes['travel_apis.update_banner']
    destroyBanner: typeof routes['travel_apis.destroy_banner']
    destroyReview: typeof routes['travel_apis.destroy_review']
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
}
