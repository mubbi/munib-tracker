Pod::Spec.new do |s|
  s.name           = 'MunibNearby'
  s.version        = '1.0.0'
  s.summary        = 'Bluetooth LE nearby join beacon (CoreBluetooth) for Munib Tracker circles.'
  s.description    = 'Local Expo module for NF-3.25: CBPeripheralManager advertises one 128-bit service UUID while the host invite screen is open; CBCentralManager scans in the foreground while the Join nearby sheet is open. No GATT, no connections, no background modes.'
  s.author         = 'Munib Tracker'
  s.homepage       = 'https://munibtracker.app'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.10'

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'CoreBluetooth'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
