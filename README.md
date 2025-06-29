# Munib (مُنيب) Tracker

Tracking salah, dhikr, and qadha in your journey back to Allah.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@munib-tracker/ui`: a stub React component library shared by both `web` and `docs` applications
- `@munib-tracker/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@munib-tracker/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd munib-tracker
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd munib-tracker
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd munib-tracker
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/docs/reference/configuration)
- [CLI Usage](https://turbo.build/docs/reference/command-line-reference)

# Common Commands

- Enable Remote Caching (recommended): pnpm dlx turbo login
  - Learn more: https://turbo.build/repo/remote-cache
- Run commands with Turborepo:
  - pnpm run build: Build all apps and packages
  - pnpm run dev: Develop all apps and packages
  - pnpm run lint: Lint all apps and packages
- Run a command twice to hit cache

---

### Share with the community

Please consider sharing a post about Munib Tracker and the value it provides. It really does help!

[![Tweet](https://img.shields.io/badge/Twitter-1DA1F2?logo=twitter&logoColor=white)](https://twitter.com/intent/tweet?text=Check%20out%20this%20GitHub%20repo%20for%20Munib%20Tracker!&url=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker)
[![Share on Reddit](https://img.shields.io/badge/Reddit-FF4500?logo=reddit&logoColor=white)](https://reddit.com/submit?title=Munib%20Tracker%20Repo&url=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker)
[![Share on LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker)
[![Share on Facebook](https://img.shields.io/badge/Facebook-1877F2?logo=facebook&logoColor=white)](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker)
[![Discuss on Hacker News](https://img.shields.io/badge/Hacker%20News-FF6600?logo=ycombinator&logoColor=white)](https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker&t=Munib%20Tracker%20Repo)
[![Share on Dev.to](https://img.shields.io/badge/Dev.to-0A0A0A?logo=dev.to&logoColor=white)](https://dev.to/new)

---

![GitHub stars](https://img.shields.io/github/stars/mubbi/munib-tracker)
![GitHub forks](https://img.shields.io/github/forks/mubbi/munib-tracker)
![GitHub license](https://img.shields.io/github/license/mubbi/munib-tracker)

## 📜 License

This project is open source under the [Creative Commons BY-NC 4.0 License](https://creativecommons.org/licenses/by-nc/4.0/).

✅ Free for personal and educational use.  
🚫 Not allowed for commercial use.  
🔗 Please credit this project with a backlink if you use any part of the code.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
