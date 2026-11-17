# Quran Lab TajweedFormer bridge (Phase 6 pronunciation drills).
#
# The Apple SDK is a Swift package (`Quran-Lab/tajweedformer-apple`, from 3.1.4,
# product `TajweedFormer`), iOS 15+ on Apple silicon (arm64 devices / arm64
# simulator only — no x86_64 simulator). CocoaPods cannot depend on a Swift
# package directly, so this uses React Native's `spm_dependency` podspec helper
# (react-native ≥ 0.75; this app runs react-native-tvos 0.86).
#
# iOS only: the platforms list has no :tvos, so the tvOS Podfile never links it
# (and `plugins/withTvExpoModuleExcludes.cjs` also excludes it on TV prebuilds).
# The app's deployment target is Expo SDK 57's default (15.1), which satisfies iOS 15.
Pod::Spec.new do |s|
  s.name           = 'MunibTajweedformer'
  s.version        = '1.0.0'
  s.summary        = 'Quran Lab TajweedFormer bridge for Munib Tracker pronunciation drills.'
  s.description    = 'Wraps the Quran Lab TajweedFormer Swift SDK (client, model, listen, read) for Expo.'
  s.author         = 'Munib Tracker'
  s.homepage       = 'https://munibtracker.app'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  if defined?(spm_dependency)
    spm_dependency(s,
      url: 'https://github.com/Quran-Lab/tajweedformer-apple',
      requirement: { kind: 'upToNextMinorVersion', minimumVersion: '3.1.4' },
      products: ['TajweedFormer']
    )
  else
    raise 'MunibTajweedformer needs React Native\'s spm_dependency helper (react-native >= 0.75).'
  end

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
