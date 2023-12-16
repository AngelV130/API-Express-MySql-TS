export type Weather = 'sunny' | 'rain' | 'cloudy' | 'stormy';
export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export interface DiaryEntry {
    id: number
    date: string
    weather: Weather
    visibility: Visibility
    comment: string
}