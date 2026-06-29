/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'travel_apis.banners': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/banners',
    tokens: [{"old":"/api/v1/banners","type":0,"val":"api","end":""},{"old":"/api/v1/banners","type":0,"val":"v1","end":""},{"old":"/api/v1/banners","type":0,"val":"banners","end":""}],
    types: placeholder as Registry['travel_apis.banners']['types'],
  },
  'travel_apis.packages': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/packages',
    tokens: [{"old":"/api/v1/packages","type":0,"val":"api","end":""},{"old":"/api/v1/packages","type":0,"val":"v1","end":""},{"old":"/api/v1/packages","type":0,"val":"packages","end":""}],
    types: placeholder as Registry['travel_apis.packages']['types'],
  },
  'travel_apis.reviews': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/reviews',
    tokens: [{"old":"/api/v1/reviews","type":0,"val":"api","end":""},{"old":"/api/v1/reviews","type":0,"val":"v1","end":""},{"old":"/api/v1/reviews","type":0,"val":"reviews","end":""}],
    types: placeholder as Registry['travel_apis.reviews']['types'],
  },
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'travel_apis.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/travel-data',
    tokens: [{"old":"/api/travel-data","type":0,"val":"api","end":""},{"old":"/api/travel-data","type":0,"val":"travel-data","end":""}],
    types: placeholder as Registry['travel_apis.index']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
