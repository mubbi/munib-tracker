# Munib - Product Requirements Document (PRD)

## Overview

**Munib** is an Islamic productivity and worship tracking application designed to help Muslims consistently perform acts of worship, track missed prayers (Qaza), complete daily adhkar (Zikr), and build better spiritual habits through reminders, statistics, achievements, and personalized schedules.

---

# Core Features

## 🌍 General

- Multi-language support
- Light/dark/system Theme
- Offline-first experience (where possible)
- Cloud Sync (for logged-in users)
- Guest Mode

---

# Authentication

## Login

- Google Login
- Apple Login
- Facebook Login
- Continue as Guest

## Signup

- Google Signup
- Apple Signup
- Facebook Signup
- Continue Without Signup

---

# Onboarding

## Splash Screen

- App Logo
- Loading animation

## Intro Screens

Explain app features:

- Prayer Tracking
- Qaza Management
- Zikr Tracking
- Tasbeeh Counter
- Daily Reminders
- Achievements

---

# Dashboard

## Quick Statistics

Display:

### Today's Progress

- Completed prayers
- Remaining prayers
- Today's Zikr count

### Qaza

- Remaining Qaza prayers
- Total completed Qaza
- Progress percentage

### Zikr

For every zikr category:

- Completed today
- Remaining today

---

# Prayer Tracking

## Daily Prayer Tracker

Track each prayer:

- Fajr
- Dhuhr
- Asr
- Maghrib
- Isha
- Witr

Each prayer supports:

- Completed
- Missed
- Delayed
- Qaza
- Notes (optional)

---

# Prayer History

View:

- Daily
- Weekly
- Monthly
- Yearly

History should support:

- + / - adjustments
- Counter updates
- No history creation for bulk imports

---

# Prayer Calendar

Views:

- Daily
- Weekly
- Monthly
- Yearly

Display:

- Completed prayers
- Missed prayers
- Qaza prayers
- Zikr completion

(Login required)

---

# Reminders & Notifications

Support local notifications for:

## Prayer

- Prayer reminder
- Missed prayer reminder

## Qaza

- Scheduled Qaza reminder
- Missed Qaza reminder

## Zikr

- Morning Zikr
- Evening Zikr
- Before Prayer Zikr
- After Prayer Zikr
- Before Sleep Zikr
- Missed Zikr reminder

## Azan

After each Azan:

- Remind user to read post-Azan adhkar

---

# Favorite Zikrs

(Login required)

Users can:

- Add favorite zikrs
- Remove favorite zikrs
- Reorder favorites

---

# Zikr Library

Categories:

- Morning Adhkar
- Evening Adhkar
- Before Prayer
- After Prayer
- After Azan
- Before Sleep
- Anytime Zikr
- View All

Every zikr contains:

- Title
- Arabic Text
- Arabic Audio
- Transliteration
- Translation
- Virtues
- Reference / Hadith
- Favorite option
- Share option

---

# Tasbeeh Counter

Each zikr can launch a Tasbeeh counter.

## Counter Modes

- 33
- 99
- 100
- Unlimited
- Custom Count

## Features

- Tap counter
- + Button
- - Button
- Reset
- Daily progress

## Feedback

- Vibration
- Sound
- Disable feedback

## Themes

Support multiple counter styles:

- Traditional Tasbeeh
- Simple Counter
- Minimal
- Large Buttons

Background options:

- Makkah
- Madinah
- Islamic patterns
- Zikr text
- Solid colors

---

# Open Tasbeeh Mode

Users can open a free Tasbeeh counter for any custom zikr.

---

# Qaza Prayer Management

(Login required)

## Prayer Counters

Maintain separate counters for:

- Fajr
- Dhuhr
- Asr
- Maghrib
- Isha
- Witr

Display:

- Remaining
- Completed

---

# Qaza Calculator

(Qaza-e-Umri)

Allow users to calculate:

- Total missed prayers
- Estimated remaining prayers

---

# Qaza Planner

Allow scheduling daily Qaza targets.

Example:

Morning:

- 2 Fajr

Dhuhr:

- 2 Dhuhr

Asr:

- 2 Asr

Maghrib:

- 2 Maghrib

Isha:

- Remaining prayers

Display:

- Daily target
- Remaining target
- Estimated completion date

---

# Qaza Roza

Track:

- Total missed fasts
- Completed fasts
- Remaining fasts

## Calculator

Estimate:

- Missed Ramadan fasts
- Remaining Qaza fasts

---

# Achievements

Reward consistency.

Periods:

- Daily
- Weekly
- Monthly
- Yearly

Achievement types:

- Prayer completion
- Zikr completion
- Qaza milestones
- Streaks
- Consistency
- Special badges

Support:

- Social sharing

---

# Names of Allah

Display all 99 Names.

Each item includes:

- Arabic
- Translation
- Transliteration
- Audio

Support:

- Play individual
- Play all

---

# Duroods / Salawat

Library of Duroods.

Each contains:

- Title
- Arabic
- Audio
- Transliteration
- Translation
- Virtues
- References

---

# Dua Library

Categories:

- Sunnah Duas
- Quranic Duas
- Daily Duas
- View All

Each dua includes:

- Title
- Arabic
- Audio
- Transliteration
- Translation
- Virtues
- References

---

# Global Audio Player

Single reusable audio player.

Should support:

- Play
- Pause
- Seek
- Previous
- Next
- Playback Speed

Playback speeds:

- 0.5x
- 1x
- 1.5x
- 2x

Should work for:

- Zikr
- Dua
- Quran verses
- Names of Allah
- Duroods

---

# Qibla Direction

Features:

- Compass
- Qibla direction
- Distance
- Calibration instructions

---

# Profile

Fields:

- Avatar
- First Name
- Last Name
- Email
- Authentication Provider

---

# Settings

## Notifications

Enable/Disable:

- Prayer reminders
- Qaza reminders
- Morning Zikr
- Evening Zikr
- Before Prayer
- After Prayer
- Before Sleep
- After Azan
- Achievement notifications

---

## Bedtime

User-defined bedtime.

Used for:

- Before sleep adhkar reminder

---

## Fonts

Customize:

### Global

- Font Family
- Font Size
- Font Color

### Arabic

- Font
- Size

### Translation

- Font
- Size

### Transliteration

- Font
- Size

### Titles

- Font
- Size

---

## Language

Support:

- Application language
- Translation language

---

# Statistics

Display totals:

## Prayer

- Completed
- Missed

## Qaza

- Remaining
- Completed

## Roza

- Remaining
- Completed

## Zikr

Per category:

- Completed
- Remaining

Charts:

- Daily
- Weekly
- Monthly
- Yearly

---

# About

Display:

- Author
- Collaborators
- Contributors
- Dua for Author
- Dua for Collaborators
- Dua for Marhumeen
- Content authenticity statement
- App version
- Privacy Policy
- Terms of Service

---

# Future Features (Optional)

- Wear OS / Apple Watch support
- Widgets
- Home Screen Quick Actions
- Cloud Backup
- Family Sharing
- Friends & Accountability
- Ramadan Mode
- Hajj & Umrah Mode
- Quran Reading Tracker
- Charity Tracker
- Habit Streaks
- AI-powered Islamic assistant
- Smart recommendations based on missed worship