Pod::Spec.new do |s|
  s.name           = 'MunibTvHome'
  s.version        = '1.0.0'
  s.summary        = 'Apple TV Top Shelf data bridge for Munib Tracker.'
  s.description    = 'Local Expo module: writes the TV home payload to the shared App Group and asks tvOS to reload the Top Shelf extension. TV builds only (react-native.config.js).'
  s.author         = 'Munib Tracker'
  s.homepage       = 'https://munibtracker.app'
  # Matches ExpoModulesCore's tvOS floor. iOS is listed only so `pod install` never
  # fails if the module is ever linked into a phone build; it no-ops there.
  s.platforms      = { :tvos => '16.4', :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.10'

  s.dependency 'ExpoModulesCore'
  s.tvos.frameworks = 'TVServices'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
