# 災害資訊積木 Starter

SITCON Camp 2026 軟體工程工作坊 starter repo。

這是一個前端-only 的學習原型專案，用於練習：

- SDD-lite
- schema / data contract
- mock data
- event injection
- adapter
- handoff
- AI-assisted development

完整課程脈絡請先讀：[`docs/course-context.md`](docs/course-context.md)。

## 快速開始

```bash
pnpm install
pnpm run dev
```

## 常用指令

```bash
pnpm run validate:data
pnpm run test
pnpm run build
pnpm run check
```

## 課程限制

- 不做後端服務
- 不使用真實個資
- 不呼叫真實 LLM runtime API
- `events/**` 是外部 dirty data
- `src/fixtures/**` 是 normalized internal data，必須通過 validation
- starter repo 不放 team-specific brief、hidden event data、mentor guide 或 expected answer

## 授權

- 程式碼：MIT
- 教案與文件：CC BY-SA
- mock data：CC0
