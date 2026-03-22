import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

Guarda con **Ctrl + S**.

Ahora necesitamos crear el archivo de deploy automático. En la terminal ejecuta:
```
mkdir .github\workflows