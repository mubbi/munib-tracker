Pod::Spec.new do |s|
  s.name           = 'MunibLiveActivity'
  s.version        = '1.0.0'
  s.summary        = 'Prayer next-prayer Live Activity (iOS ActivityKit) for Munib Tracker.'
  s.description    = 'Local Expo module that starts, updates, and ends the iOS prayer Live Activity (NF-1.19).'
  s.author         = 'Munib Tracker'
  s.homepage       = 'https://munibtracker.app'
  s.platforms      = { :ios => '16.2' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
