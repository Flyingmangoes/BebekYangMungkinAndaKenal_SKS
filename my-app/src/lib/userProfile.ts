export interface UserProfile {
  name: string
  fullName: string
  modeLabel: string
  energyLabel: string
  moodLabel: string
  locationLabel: string
  temperatureLabel: string
  weekRhythmLabel: string
}

export const CURRENT_USER: UserProfile = {
  name: 'Nadia',
  fullName: 'Nadia Laraasati',
  modeLabel: 'Mode: Santai, Aktif',
  energyLabel: 'Teduh & Cukup',
  moodLabel: 'Santai',
  locationLabel: 'Jakarta',
  temperatureLabel: '28°C',
  weekRhythmLabel: '6 hari tenang',
}
