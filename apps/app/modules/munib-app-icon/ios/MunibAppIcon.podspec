Pod::Spec.new do |s|
  s.name           = 'MunibAppIcon'
  s.version        = '1.0.0'
  s.summary        = 'Seasonal alternate app icons for Munib Tracker.'
  s.description    = 'Local Expo module for NF-2.23b: switches between the primary icon and the bundled seasonal icon sets (AppIcon-<id>) with UIApplication.setAlternateIconName. The icon sets and the ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES build setting come from app.plugin.js.'
  s.author         = 'Munib Tracker'
  s.homepage       = 'https://munibtracker.app'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.10'

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
