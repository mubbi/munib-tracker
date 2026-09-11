# Changelog

## [1.2.1](https://github.com/mubbi/munib-tracker/compare/app-v1.2.0...app-v1.2.1) (2026-09-11)


### Bug Fixes

* **app:** cap Quran page layout work to avoid iOS TextKit hangs ([eba53ed](https://github.com/mubbi/munib-tracker/commit/eba53edf99f2aa24be69f397a1ac890238c56d36))
* **app:** copy tab icons as drawables to avoid Fresco ANR ([0318ba4](https://github.com/mubbi/munib-tracker/commit/0318ba4cc4c664726bb2af92ee33067a15cff16d))
* **app:** defer first-run work that trips the iOS watchdog ([c6c99e3](https://github.com/mubbi/munib-tracker/commit/c6c99e3ca947d29d684e64d5b81db7605409a44b))
* **app:** prevent ExpoQuickActions NPE on Android shortcut sync ([028b11a](https://github.com/mubbi/munib-tracker/commit/028b11a3bab5223ab00622e801cd6cf2f36022ab))
* **app:** recover when the OS refuses to schedule notifications ([83c36a4](https://github.com/mubbi/munib-tracker/commit/83c36a4220dc3b47e3f5709f95228d1b84e09c0b))
* **app:** shard AsyncStorage caches under the SQLite size limit ([7d143e7](https://github.com/mubbi/munib-tracker/commit/7d143e70d05e804b6a5e78e37e04a05c77b88393))
* **app:** stop FluidSpring animations that hang iOS UI ([4537b08](https://github.com/mubbi/munib-tracker/commit/4537b08bad8eaee24a8928588f2edef0154c66d5))
* keep lock-screen Live Activity moving past 00:00 ([241c92e](https://github.com/mubbi/munib-tracker/commit/241c92ede2f4b9b033140dc0495bc82de6674e90))

## [1.2.0](https://github.com/mubbi/munib-tracker/compare/app-v1.1.2...app-v1.2.0) (2026-09-11)


### Features

* add Hindi locale and excused-period carry-forward ([3482ecd](https://github.com/mubbi/munib-tracker/commit/3482ecdf42210bd36e968a3289413afdda37a780))


### Bug Fixes

* android warnings, errors and optimizations ([367409a](https://github.com/mubbi/munib-tracker/commit/367409a38b7d894c5ee8a1f361db72f8ce8a52ea))
* apple icon ([c62e390](https://github.com/mubbi/munib-tracker/commit/c62e3907db75f47083456afbf8912b79a6055be2))
* apple watch icon ([dad543f](https://github.com/mubbi/munib-tracker/commit/dad543faf071ad7211558ff033452f345ec55a6e))
* apple watch icons ([485cdd1](https://github.com/mubbi/munib-tracker/commit/485cdd1d5c4e20353f87617ecd71b73658193353))
* splash logo visibility ([d590a06](https://github.com/mubbi/munib-tracker/commit/d590a062a2bdbd9b35972bf3da32e7491402af8b))

## [1.1.2](https://github.com/mubbi/munib-tracker/compare/app-v1.1.1...app-v1.1.2) (2026-08-08)


### Bug Fixes

* **ci:** biome-format app.json after Release Please expo rewrite ([358868c](https://github.com/mubbi/munib-tracker/commit/358868c20affaefd2f49f37f16c40e5b78f8dadb))
* github ai reported issues ([4cd2aa5](https://github.com/mubbi/munib-tracker/commit/4cd2aa57572882c55fdd7441b5b2c38f349af449))
* optimizations issues in surah player ([ba3f0d7](https://github.com/mubbi/munib-tracker/commit/ba3f0d765afeb03c032836d0d3d3158075995151))

## [1.1.1](https://github.com/mubbi/munib-tracker/compare/app-v1.1.0...app-v1.1.1) (2026-08-04)


### Bug Fixes

* dua and zikr ([2be5620](https://github.com/mubbi/munib-tracker/commit/2be56200f4fa6932b18363d35046e4773dad6b6b))
* store issues ([5d49181](https://github.com/mubbi/munib-tracker/commit/5d491814f61a1b762dc54340aa364b04996816ef))

## [1.1.0](https://github.com/mubbi/munib-tracker/compare/app-v1.0.0...app-v1.1.0) (2026-08-02)


### Features

* article and fixes ([ea4df40](https://github.com/mubbi/munib-tracker/commit/ea4df40ffbf7ed7f442af72f7612f47c73caf059))
* content for character and deeds weight ([115dd72](https://github.com/mubbi/munib-tracker/commit/115dd72972eaa1ff98af32ef5f44e46d857fe7b1))
* initial setup ([cb4b123](https://github.com/mubbi/munib-tracker/commit/cb4b1231bea5d0673e3969ca9b51b25d63fc273a))


### Bug Fixes

* android bugs ([1e72304](https://github.com/mubbi/munib-tracker/commit/1e72304ecfd52a057cdb4412d8693a6b43db8be0))
* codeql issues ([2ebb674](https://github.com/mubbi/munib-tracker/commit/2ebb6749029459519a91f5913b5f4cf372cc0cd8))
* ui of scale ([d2c00d5](https://github.com/mubbi/munib-tracker/commit/d2c00d55bd8c1a819f41d8527d557cbb83a54fb5))

## Changelog

All notable changes to the Munib Tracker product app (`apps/app`) are documented here.

Releases are managed by [Release Please](https://github.com/googleapis/release-please-action).
See [`docs/RELEASES.md`](../../docs/RELEASES.md).
