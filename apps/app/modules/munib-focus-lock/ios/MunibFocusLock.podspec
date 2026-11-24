Pod::Spec.new do |s|
  s.name           = 'MunibFocusLock'
  s.version        = '1.0.0'
  s.summary        = 'Salah focus lock (FamilyControls / ManagedSettings / DeviceActivity) for Munib Tracker.'
  s.description    = 'Local Expo module for NF-3.13: Screen Time authorization, the app picker, and DeviceActivity scheduling of the prayer-time shield.'
  s.author         = 'Munib Tracker'
  s.homepage       = 'https://munibtracker.app'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.10'

  s.dependency 'ExpoModulesCore'
  # Weak so a build without the Family Controls entitlement (D17) still launches.
  s.weak_frameworks = 'FamilyControls', 'ManagedSettings', 'DeviceActivity'
  s.frameworks = 'BackgroundTasks', 'UserNotifications'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
