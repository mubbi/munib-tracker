Pod::Spec.new do |s|
  s.name           = 'MunibExternalCommands'
  s.version        = '1.0.0'
  s.summary        = 'External command queue, WatchConnectivity, and Wear sync for Munib Tracker.'
  s.description    = 'Queues Siri/watch/assistant commands and bridges WatchConnectivity messages to JS.'
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
