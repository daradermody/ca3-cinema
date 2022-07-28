const POSTER_PLACEHOLDER = 'https://critics.io/img/movies/poster-placeholder.png'

export function getPoster(suffix?: string): string {
  return suffix ? `https://image.tmdb.org/t/p/w220_and_h330_face${suffix}` : POSTER_PLACEHOLDER
}
