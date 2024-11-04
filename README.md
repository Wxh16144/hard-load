# hard-load

> 🧹清理某些约定目录，以避免缓存带来的干扰~

## 安装

```bash
npm install hard-load -D

# or
yarn add hard-load
pnpm add hard-load
```

## 使用

```diff
{
  "scripts": {
-    "dev": "vite",
+    "dev": "npx hard-load && vite",
  }
}
```
