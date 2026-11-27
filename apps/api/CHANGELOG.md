# Changelog

## [1.4.0](https://github.com/mubbi/munib-tracker/compare/api-v1.3.0...api-v1.4.0) (2026-11-27)


### Features

* add a finance reading surface and jahannam/last-day report kinds ([a80a983](https://github.com/mubbi/munib-tracker/commit/a80a983b5c7a765eb96ea8de220b054f9a6aae01))
* **api:** add circles, masjid finder and encrypted sync entities ([63a9e32](https://github.com/mubbi/munib-tracker/commit/63a9e326741d866f5659c05e77ffacd2165ae268))
* **api:** nearby join, private sync hardening and safer errors ([6ea26f4](https://github.com/mubbi/munib-tracker/commit/6ea26f4a960b1a07ccc5a814886be9e26f372b6a))
* native review sheet only at value moments, private app feedback (D76) ([14f2814](https://github.com/mubbi/munib-tracker/commit/14f28147f9f1084de19794c6dbc3bf6f15890800))
* search masjids via geoapify with overpass fallback and better timetable import ([7ed15c6](https://github.com/mubbi/munib-tracker/commit/7ed15c6418f1c67dce8540074c1139945fbe17ed))


### Bug Fixes

* **api:** block web push ssrf and harden uploads, sync and reports ([b4284af](https://github.com/mubbi/munib-tracker/commit/b4284afd7c420a1e4a337902285ce5631aecb386))
* **api:** erase the email when an account is deleted ([375ea1d](https://github.com/mubbi/munib-tracker/commit/375ea1d6f071963ba596d0cc21a9c6464c826e72))
* **api:** hash refresh tokens at rest and harden oauth and logout ([269f2b1](https://github.com/mubbi/munib-tracker/commit/269f2b1c48961b161d0fcdbba6f5ee25af9d7137))
* **api:** load only timestamped migrations in the TypeORM CLI ([3dc80a2](https://github.com/mubbi/munib-tracker/commit/3dc80a2aed3b04f9560e396070f69eb45fdf795c))
* resolve CodeQL alerts on the develop to main PR ([fe138e0](https://github.com/mubbi/munib-tracker/commit/fe138e03ff669caba4d60118537b2442eab9d43c))

## [1.3.0](https://github.com/mubbi/munib-tracker/compare/api-v1.2.1...api-v1.3.0) (2026-11-18)


### Features

* **api:** sync Qur'an practice entities ([41499bd](https://github.com/mubbi/munib-tracker/commit/41499bd4dcdec652a9f8012cc58b21809d4096ea))


### Bug Fixes

* **api:** harden push, Live Activity and surface job delivery ([869f710](https://github.com/mubbi/munib-tracker/commit/869f7100a5bb4d750cc172c153ffa2bd70ff40fc))
* **api:** keep non-ASCII upload filenames and avoid orphaned media ([3fb86e3](https://github.com/mubbi/munib-tracker/commit/3fb86e3297d783439f13996e70e42906ae8ca2d0))
* **api:** restore body parsing and auth validation on NestJS 12 ([d1c18f1](https://github.com/mubbi/munib-tracker/commit/d1c18f1f3f1e6afcce693bafa6c907663dd7ada3))

## [1.2.1](https://github.com/mubbi/munib-tracker/compare/api-v1.2.0...api-v1.2.1) (2026-09-11)


### Bug Fixes

* keep lock-screen Live Activity moving past 00:00 ([241c92e](https://github.com/mubbi/munib-tracker/commit/241c92ede2f4b9b033140dc0495bc82de6674e90))

## [1.2.0](https://github.com/mubbi/munib-tracker/compare/api-v1.1.0...api-v1.2.0) (2026-09-11)


### Features

* add Hindi locale and excused-period carry-forward ([3482ecd](https://github.com/mubbi/munib-tracker/commit/3482ecdf42210bd36e968a3289413afdda37a780))

## [1.1.0](https://github.com/mubbi/munib-tracker/compare/api-v1.0.0...api-v1.1.0) (2026-08-02)


### Features

* initial setup ([cb4b123](https://github.com/mubbi/munib-tracker/commit/cb4b1231bea5d0673e3969ca9b51b25d63fc273a))


### Bug Fixes

* codeql feedbacks ([fdd8802](https://github.com/mubbi/munib-tracker/commit/fdd8802e5c6f7e3aa74d0a9fea38df0e686e612a))
* codeql issues ([2ebb674](https://github.com/mubbi/munib-tracker/commit/2ebb6749029459519a91f5913b5f4cf372cc0cd8))

## Changelog

All notable changes to the Munib Tracker API (`apps/api`) are documented here.

Releases are managed by [Release Please](https://github.com/googleapis/release-please-action).
See [`docs/RELEASES.md`](../../docs/RELEASES.md).
