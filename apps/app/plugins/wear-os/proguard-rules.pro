# Wear OS tiles (R8). Tile services are kept through the manifest; libraries ship
# their own consumer rules. Guava references compile-only annotation jars.
-dontwarn com.google.errorprone.annotations.**
-dontwarn com.google.j2objc.annotations.**
-dontwarn javax.annotation.**
-dontwarn org.checkerframework.**
