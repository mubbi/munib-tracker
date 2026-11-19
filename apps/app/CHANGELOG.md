# Changelog

## [1.3.1](https://github.com/mubbi/munib-tracker/compare/app-v1.3.0...app-v1.3.1) (2026-11-18)


### Bug Fixes

* android tv config ([99aa0a5](https://github.com/mubbi/munib-tracker/commit/99aa0a5c0f7e26eeb5b404f5bd349ba58af812b6))
* **app:** self-host tajweedformer web sdk so its wasm resolves ([ee0a26b](https://github.com/mubbi/munib-tracker/commit/ee0a26bc0043564e4974fac21349cb7b76d993a3))

## [1.3.0](https://github.com/mubbi/munib-tracker/compare/app-v1.2.1...app-v1.3.0) (2026-11-18)


### Features

* **app:** add a session summary to Qur'an recitation practice ([dfbd67d](https://github.com/mubbi/munib-tracker/commit/dfbd67d82ce994ccb74493df6081fee302967e38))
* **app:** add Precise Adhan timing and make push registrations reliable ([6e521ea](https://github.com/mubbi/munib-tracker/commit/6e521ead2f37e7b5b1bc06a8792964cc58830bab))
* **app:** add Qur'an practice companion, TV and large-screen web UX ([ce5787d](https://github.com/mubbi/munib-tracker/commit/ce5787dac3ab397423181cc27d207f6f150c55d4))
* **app:** condense flash card options to a glanceable length ([358d538](https://github.com/mubbi/munib-tracker/commit/358d538e921dd930ed787c4becf81c0abe6aa68c))
* **app:** declutter the Qur'an index and show facing mushaf pages ([8ee4bf1](https://github.com/mubbi/munib-tracker/commit/8ee4bf1d98bb67a5a3425829b5f1437e598cef44))
* **app:** enable web speech-to-text with language fallbacks ([f33e7ae](https://github.com/mubbi/munib-tracker/commit/f33e7ae80862a8388655b9ef9b3171c229d3c4ec))
* **app:** place the sun and moon in the home hero sky ([3231ba9](https://github.com/mubbi/munib-tracker/commit/3231ba942793f2c41a93aa8cd760ab601e10e20c))
* **app:** render static web metadata for every route ([18d0a50](https://github.com/mubbi/munib-tracker/commit/18d0a503d2b7a0d32afd72541837e7b4f256026c))
* **app:** tabletop tasbeeh layout on foldables ([acf6d83](https://github.com/mubbi/munib-tracker/commit/acf6d83ff6775095cba528da29c48193ba7f5c40))
* **i18n:** translate Qur'an practice, Qur'an search and Precise Adhan strings ([16796f2](https://github.com/mubbi/munib-tracker/commit/16796f2425248e0519cfba5b03c2dbe3159ef99a))
* **theme:** rebalance surface ladder and add card/input tokens ([902e97d](https://github.com/mubbi/munib-tracker/commit/902e97da7b0f80b5fa7630e3bdd2654da404990a))


### Bug Fixes

* **app:** advance the queue when the next track was not preloaded ([5d1640a](https://github.com/mubbi/munib-tracker/commit/5d1640a2a06d637d9fd79c20b65350809ab96165))
* **app:** call gradlew by absolute path in Android scripts ([3b22b68](https://github.com/mubbi/munib-tracker/commit/3b22b680ad528e80525c6ba006efb78446f61f11))
* **app:** fall back from jsDelivr to GitHub raw and quiet network noise in Sentry ([1803b70](https://github.com/mubbi/munib-tracker/commit/1803b702906860b114dacc1d2b2478d3382f7f64))
* **app:** isolate onnxruntime symbol from TajweedFormer shim on iOS ([78861ee](https://github.com/mubbi/munib-tracker/commit/78861eef94f2938a20c2291f75e52c2544d18106))
* **app:** keep recitation focus and lock-screen controls in sync with expo-audio 58 ([02f2ede](https://github.com/mubbi/munib-tracker/commit/02f2eded3162b1477b24dd40dadfb9faecc5615c))
* **app:** keep the review sheet open when feedback fails to send ([3057ab6](https://github.com/mubbi/munib-tracker/commit/3057ab64b388fc4a869dd9890dfa5fc828696384))
* **app:** keep whole-number zeros when reformatting number inputs ([b39e4c1](https://github.com/mubbi/munib-tracker/commit/b39e4c1de53347b83b8982968d3b48d3f04a90c2))
* **app:** load the Hindi SEO overlay at runtime ([412a140](https://github.com/mubbi/munib-tracker/commit/412a1405bff287edeee5edde68100b3ac7ccc820))
* **app:** make practice-session teardown best-effort ([12e15f3](https://github.com/mubbi/munib-tracker/commit/12e15f3067b6255d13fc2bf48f6796e55cedfdc9))
* **app:** queue watch marks via transferUserInfo and tweak widget background ([24accb2](https://github.com/mubbi/munib-tracker/commit/24accb213ec33c2c5d7409e252ae1c5b76992e04))
* **app:** report OSS download failures to Sentry again ([47721a8](https://github.com/mubbi/munib-tracker/commit/47721a8e9dc352624e4884fb08e306171d2a65fa))
* **app:** resolve clock-time notification triggers against nowMs ([0a70f27](https://github.com/mubbi/munib-tracker/commit/0a70f27e179924da367935ccb2163a8fc5e42eff))
* **app:** stop one failing external command from dropping the batch ([3a194e1](https://github.com/mubbi/munib-tracker/commit/3a194e145c8042545fda6e84746f62928ce3b901))
* **app:** stop settings row titles breaking mid-word ([1e857a1](https://github.com/mubbi/munib-tracker/commit/1e857a1b61e8e97f87da497b579c90c032f62957))
* **app:** tvOS codegen, storage patch and TV layout fixes ([6f5adcd](https://github.com/mubbi/munib-tracker/commit/6f5adcd27b93efa92ded1dc2dcb68f9ff8f61b60))
* sentry bugs ([d562cfa](https://github.com/mubbi/munib-tracker/commit/d562cfaa699b2a2a7a96eb30ec2d62a6b81839e7))

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
