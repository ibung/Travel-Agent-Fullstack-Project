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
    'travel_apis.store_review': { paramsTuple?: []; params?: {} }
    'travel_apis.store': { paramsTuple?: []; params?: {} }
    'travel_apis.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travel_apis.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travel_apis.store_banner': { paramsTuple?: []; params?: {} }
    'travel_apis.update_banner': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travel_apis.destroy_banner': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travel_apis.destroy_review': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travel_apis.get_public_images': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'travel_apis.banners': { paramsTuple?: []; params?: {} }
    'travel_apis.packages': { paramsTuple?: []; params?: {} }
    'travel_apis.reviews': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'travel_apis.index': { paramsTuple?: []; params?: {} }
    'travel_apis.get_public_images': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'travel_apis.banners': { paramsTuple?: []; params?: {} }
    'travel_apis.packages': { paramsTuple?: []; params?: {} }
    'travel_apis.reviews': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'travel_apis.index': { paramsTuple?: []; params?: {} }
    'travel_apis.get_public_images': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'travel_apis.store_review': { paramsTuple?: []; params?: {} }
    'travel_apis.store': { paramsTuple?: []; params?: {} }
    'travel_apis.store_banner': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'travel_apis.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travel_apis.update_banner': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'travel_apis.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travel_apis.destroy_banner': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travel_apis.destroy_review': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}