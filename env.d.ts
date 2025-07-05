/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
}

declare namespace NodeJS {
  // 基础：补充缺失的类型（如 Timer，根据报错调整）
  type Timer = any;

  // 进阶：若用到环境变量，可扩展 ProcessEnv（示例）
  interface ProcessEnv {
    VITE_APP_API: string; // 匹配项目的环境变量
  }
}
