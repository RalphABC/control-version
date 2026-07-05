# 🚜 AgroTech - Landing Page Profesional

Landing page moderna y altamente interactiva para maquinaria agrícola, construida con Next.js 15, TypeScript y Tailwind CSS.

## ✨ Características Destacadas

### 🎨 Diseño y UX
- **Dual Theme System**: Modo claro/oscuro + Modo Motocultores/Bombas
- **Animaciones Avanzadas**: Parallax, fade-in, float, gradientes animados
- **Totalmente Responsive**: Optimizado para móvil, tablet y desktop
- **Glassmorphism**: Efectos de vidrio y blur modernos
- **Micro-interacciones**: Hover effects, scale, rotaciones suaves

### 🚀 Tecnología
- **Next.js 15** con App Router
- **TypeScript** para type-safety
- **Tailwind CSS** para estilos utilitarios
- **Lucide React** para iconos modernos
- **Context API** para manejo de estado global

### 📱 Componentes Modulares
1. **ThemeContext**: Gestión centralizada de temas
2. **Header**: Navegación sticky con blur effect
3. **Hero**: Sección principal con animaciones parallax
4. **Features**: Grid de beneficios con scroll reveal
5. **ProductShowcase**: Carousel interactivo de productos
6. **CTA**: Formulario de contacto profesional

## 📂 Estructura del Proyecto

```
landing-page/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx             # Página home
│   │   └── globals.css          # Estilos globales
│   ├── components/
│   │   ├── Header.tsx           # Navegación
│   │   ├── Hero.tsx             # Hero section
│   │   ├── Features.tsx         # Sección de beneficios
│   │   ├── ProductShowcase.tsx  # Carousel de productos
│   │   └── CTA.tsx              # Formulario de contacto
│   └── contexts/
│       └── ThemeContext.tsx     # Context de temas
├── public/                       # Archivos estáticos
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🛠️ Instalación

```bash
# Ya ejecutaste este comando:
npx create-next-app@latest landing-page --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navegar al proyecto
cd landing-page

# Instalar dependencias adicionales
npm install lucide-react

# Ejecutar en desarrollo
npm run dev
```

## 📝 Implementación Paso a Paso

### 1. Crear el Context de Temas
Crear archivo `src/contexts/ThemeContext.tsx` con el código proporcionado.

### 2. Actualizar Layout Principal
Reemplazar `src/app/layout.tsx` con el código que incluye ThemeProvider.

### 3. Crear Componentes
Crear todos los componentes en `src/components/`:
- Header.tsx
- Hero.tsx
- Features.tsx
- ProductShowcase.tsx (opcional pero recomendado)
- CTA.tsx

### 4. Actualizar Página Principal
Reemplazar `src/app/page.tsx` importando todos los componentes.

### 5. Estilos Globales
Reemplazar `src/app/globals.css` con las animaciones personalizadas.

## 🎨 Paleta de Colores

### Modo Motocultores
- Primario: `yellow-400` → `amber-500`
- Acento: Amarillo dorado
- Fondo oscuro: `zinc-950`
- Fondo claro: `zinc-50`

### Modo Bombas
- Primario: `yellow-400` → `cyan-400` → `blue-500`
- Acento: Gradiente amarillo-azul
- Fondo oscuro: `zinc-950`
- Fondo claro: `zinc-50`

## 🔧 Personalización

### Cambiar Colores
Editar `ThemeContext.tsx`:
```typescript
const accentGradient = isMotocultores 
  ? 'from-your-color-1 via-your-color-2 to-your-color-3' 
  : 'from-other-color-1 via-other-color-2 to-other-color-3';
```

### Agregar Nuevas Secciones
1. Crear componente en `src/components/`
2. Importar en `page.tsx`
3. Usar hooks de `useTheme()` para acceder a colores dinámicos

### Modificar Animaciones
Editar `globals.css` para ajustar velocidades, delays y efectos.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Todos los componentes incluyen clases responsive: `sm:`, `md:`, `lg:`, `xl:`

## 🚀 Optimizaciones Incluidas

- ✅ Lazy loading de componentes
- ✅ Intersection Observer para animaciones
- ✅ CSS optimizado con Tailwind
- ✅ Imágenes y fuentes optimizadas
- ✅ Smooth scrolling nativo
- ✅ Accessibility (ARIA labels)
- ✅ SEO básico configurado

## 🎯 Próximos Pasos Recomendados

1. **Agregar imágenes reales**: Reemplazar emojis con fotos de productos
2. **Integrar videos**: Agregar demos de productos en ProductShowcase
3. **Backend**: Conectar formulario de contacto con API
4. **Analytics**: Implementar Google Analytics
5. **Testimonios**: Agregar sección de reseñas de clientes
6. **Blog**: Sistema de noticias/artículos agrícolas

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo en localhost:3000
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter de código
```

## 🌐 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Otros Servicios
- Netlify
- AWS Amplify
- Railway
- Render

## 💡 Tips de Uso

1. **Modo Producto**: Cambia entre Motocultores y Bombas para ver diferentes estilos
2. **Tema**: Alterna entre claro/oscuro para verificar contraste
3. **Responsive**: Prueba en diferentes dispositivos con DevTools
4. **Performance**: Usa Lighthouse para auditorías

## 🤝 Contribución

Este es un proyecto base personalizable. Siéntete libre de:
- Agregar más secciones
- Modificar colores y estilos
- Integrar con CMS
- Agregar multilenguaje

## 📄 Licencia

Este proyecto es de código abierto y puede ser usado libremente.

---

**Desarrollado con ❤️ para AgroTech**

Para soporte técnico o dudas: contacto@agrotech.com