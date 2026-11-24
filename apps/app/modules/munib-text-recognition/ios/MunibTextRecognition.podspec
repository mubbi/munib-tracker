Pod::Spec.new do |s|
  s.name           = 'MunibTextRecognition'
  s.version        = '1.0.0'
  s.summary        = 'On-device timetable text recognition (Apple Vision) for Munib Tracker.'
  s.description    = 'Local Expo module for NF-3.12: VNRecognizeTextRequest (.accurate, no language correction) returning word tokens with boxes. Nothing leaves the device.'
  s.author         = 'Munib Tracker'
  s.homepage       = 'https://munibtracker.app'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.10'

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'Vision', 'UIKit'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
