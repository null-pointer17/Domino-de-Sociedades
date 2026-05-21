# 🎲 Dominó de Sociedades · FundEdu

Juego educativo interactivo de Derecho Empresarial para talleres de FundEdu.  
Los estudiantes conectan fichas de dominó asociando tipos de sociedad con sus características.

## Cómo jugar

1. Aparece una ficha en el tablero con un tipo de sociedad y una característica
2. El estudiante elige entre 4 fichas cuál conecta correctamente
3. Al llegar a 10 conexiones correctas → ¡Gana! + glosario completo de las 4 sociedades

## Sociedades incluidas

| Código | Nombre completo |
|--------|----------------|
| S.A.   | Sociedad Anónima |
| E.I.R.L. | Empresa Individual de Responsabilidad Limitada |
| S.A.C. | Sociedad Anónima Cerrada |
| S.R.L. | Sociedad de Responsabilidad Limitada |

---

## ⚙️ Comandos para correr localmente

```bash
npm install
npm run dev
```

## 🚀 Comandos Git — Desde cero hasta GitHub Pages

### 1. Inicializar el repositorio local

```bash
# Entrar a la carpeta
cd domino-de-sociedades

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: Dominó de Sociedades FundEdu - versión inicial"
```

### 2. Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repo: `domino-de-sociedades`
3. Visibilidad: **Public** (necesario para GitHub Pages gratis)
4. **NO** marques "Initialize this repository" (ya lo tienes local)
5. Clic en **Create repository**

### 3. Conectar y subir al repositorio remoto

```bash
# Conectar con tu repo de GitHub (reemplaza TU_USUARIO con tu username)
git remote add origin https://github.com/TU_USUARIO/domino-de-sociedades.git

# Renombrar rama principal a main
git branch -M main

# Subir el código
git push -u origin main
```

### 4. Activar GitHub Pages (automático con el workflow)

1. En tu repo → **Settings** → **Pages**
2. En "Source" selecciona **GitHub Actions**
3. Guarda los cambios

El workflow `.github/workflows/deploy.yml` ya está configurado.  
Cada vez que hagas `git push` a `main`, se desplegará automáticamente.

### 5. URL de tu juego desplegado

```
https://TU_USUARIO.github.io/domino-de-sociedades/
```

---

### Flujo de actualizaciones futuras

```bash
# Hacer cambios en el código...

git add .
git commit -m "feat: descripción del cambio"
git push origin main

# GitHub Actions desplegará automáticamente en ~2 minutos
```

---

## 🎨 Identidad visual

Colores FundEdu: `#0396A6` · `#0AA6A6` · `#2EA684` · `#5ABF69` · `#83D95B`  
Tipografías: Montserrat (títulos) · Poppins (cuerpo)