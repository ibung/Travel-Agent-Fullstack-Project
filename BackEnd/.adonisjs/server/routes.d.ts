import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'travel_apis.banners': { paramsTuple?: []; params?: {} }
    'travel_apis.packages': { paramsTuple?: []; params?: {} }
    'travel_apis.reviews': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'travel_apis.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'travel_apis.banners': { paramsTuple?: []; params?: {} }
    'travel_apis.packages': { paramsTuple?: []; params?: {} }
    'travel_apis.reviews': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'travel_apis.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'travel_apis.banners': { paramsTuple?: []; params?: {} }
    'travel_apis.packages': { paramsTuple?: []; params?: {} }
    'travel_apis.reviews': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'travel_apis.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}