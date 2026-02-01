# 🔹 Guía de Creación de Ramas de Trabajo

La creación de ramas es un paso crítico para mantener la estabilidad del código y evitar conflictos. Cada rama representa un espacio aislado donde un desarrollador puede trabajar en una tarea sin afectar directamente la rama principal o la de desarrollo.

## 🔹 1. Condiciones Previas

La creación de una rama debe realizarse únicamente cuando exista una **tarea o issue asignado**. No se deben crear ramas de manera anticipada o sin propósito definido.

| Beneficio | Descripción |
|-----------|-------------|
| **Trazabilidad** | Cada cambio se rastrea hasta el requerimiento que lo originó |
| **Gestión clara** | En revisiones y auditorías es fácil identificar qué problema se atiende |
| **Sin duplicidad** | Evita que dos desarrolladores trabajen en lo mismo sin coordinación |
| **Responsabilidad** | Siempre se sabe quién es responsable de la rama |
| **Repositorio limpio** | Evita ramas abandonadas que entorpecen la gestión |

## 🔹 2. Nomenclatura de Ramas

El nombre de las ramas debe ser una **descripción corta y clara** de lo que se está trabajando. No se usan prefijos ya que las ramas son temporales y el tipo de cambio se define en el commit final.

```txt
<descripción-corta>
```

### 2.1. Reglas de Formato

| Regla | Descripción | Ejemplo |
|-------|-------------|---------|
| **Minúsculas** | Todo en minúsculas | `crear-clientes` ✅ `Crear-Clientes` ❌ |
| **Kebab-case** | Palabras separadas por guiones | `exportar-reportes` ✅ |
| **Sin espacios** | Usar guiones en lugar de espacios | `login-google` ✅ |
| **Corto y descriptivo** | Máximo 3-4 palabras | `filtros-busqueda` ✅ |
| **Sin caracteres especiales** | Solo letras, números y guiones | `migracion-v2` ✅ |
| **Que tenga sentido** | Cualquiera debe entender qué se trabaja | `calculo-iva` ✅ `fix-bug` ❌ |

## 🔹 3. Métodos de Creación

Una rama mal creada (desde `main` en lugar de `development`, o desde una rama desactualizada) puede introducir inconsistencias y generar conflictos costosos de resolver.

> [!NOTE]
> Ambos métodos son válidos. El equipo debe elegir cuál según las circunstancias.

### 3.1. Método Clásico

Requiere mantener la rama local `development` siempre actualizado.

**Paso 1:** Posicionarse en la rama `development`
```bash
git checkout development
```

**Paso 2:** Actualizar desde el repositorio remoto
```bash
git pull origin development
```

**Paso 3:** Crear la nueva rama
```bash
git checkout -b crear-clientes
```

**Paso 4:** Publicar en el repositorio remoto
```bash
git push -u origin crear-clientes
```

**Ventajas:**
- Refuerza la práctica de mantener la rama local `development` actualizada.

**Riesgo:**
- Si olvidas hacer `git pull`, partirás de una rama desactualizada.

### 3.2. Método Seguro

Garantiza partir siempre de lo último en remoto, sin importar el estado local.

**Paso 1:** Actualizar referencias remotas
```bash
git fetch --all
```

**Paso 2:** Crear rama desde la rama remota `origin/development`
```bash
git checkout -b crear-clientes origin/development
```

**Paso 3:** Publicar en el repositorio remoto
```bash
git push -u origin crear-clientes
```

**Ventajas:**
- Más seguro, nunca dependes de tener la rama local `development` actualizada.
- Puede ejecutarse desde cualquier rama.

**Desventaja:**
- Requiere ejecutar `git fetch --all` periódicamente para mantener referencias sincronizadas.

## 🔹 4. Resumen de Comandos

| Acción | Comando |
|--------|---------|
| Cambiar a development | `git checkout development` |
| Actualizar development | `git pull origin development` |
| Actualizar referencias | `git fetch --all` |
| Crear rama (local) | `git checkout -b <nombre>` |
| Crear rama (desde remoto) | `git checkout -b <nombre> origin/development` |
| Publicar rama | `git push -u origin <nombre>` |
