// https://nuxt.com/docs/api/configuration/nuxt-config
// import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // use this commet line with package-test.json 
  extends: [['bitbucket:vladimir-bnb/xcore-kit#develop']],
  // extends: [['bitbucket:vladimir-bnb/xcore-kit#develop', { install: true }]],
  // vite:{
  //   server:{
  //     hmr: {
  //       timeout: 0
  //     }
  //   }
  // }

  // nitro: {
  //   routeRules: {
  //     // Usa un prefix específico para tu API
  //     '/my-api/**': {
  //       proxy: 'http://10.240.208.143/interbank-core-cortex-api/api/**',
  //       cors: true,
  //     }
  //   }
  // },
  
  // runtimeConfig: {
  //   public: {
  //     apiBase: '/my-api' // ← Cambia a un prefix único
  //   }
  // }

  nitro: {
    routeRules: {
      '/my-api/**': {
        proxy: `${process.env.API_BASE_URL || 'http://10.240.208.143/interbank-core-cortex-api'}/api/**`,
        cors: true,
      }
    }
  },
  
  runtimeConfig: {
    // Variables privadas (solo servidor)
    apiBaseUrl: process.env.API_BASE_URL,
    
    // Variables públicas (cliente y servidor)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/my-api'
    }
  }
})