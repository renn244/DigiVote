import { defineConfig, loadEnv, ServerOptions } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd())

  const backendUrl = env.VITE_BACKEND_URL
  const isProduction = env.VITE_SOFTWARE_ENV === 'production'

  if(!backendUrl) throw new Error('please provide backend url in the env')
  
  let proxy = {}
  if(isProduction) {
    proxy = {
      proxy: {
        // for the rest api
        '/api': {
          target: backendUrl,
          changeOrigin: true
        }
      }
    } satisfies ServerOptions
  }

  return {
    plugins: [react()],
    server: {
      ...proxy
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  }
})
