import localForage from 'localforage';
import { fetchFilmsList } from './swapi';
import Film from '../interfaces/film';

const fileCache = localForage.createInstance({
  name: 'filmscache',
});

export const getFilmsList = async () => {

  const cachedResult = await fileCache.getItem<Film[]>(
    "starWarsFilmsList"
  );

  if (cachedResult) {
    return cachedResult;
  }

  const fetchedData = await fetchFilmsList()

  await fileCache.setItem(
    "starWarsFilmsList",
    fetchedData
  );

  return fetchedData;

}

export const getIsInFavorites = async (FilmId: number) => {

  const cachedFavoriteSet = await fileCache.getItem<Set<number>>(
    "FavoritesFilm"
  );

  if (!cachedFavoriteSet) {
    await initIsInFavorites();
    return false;
  }

  if (cachedFavoriteSet.has(FilmId)) {
    return true;
  }

  return false;

}

export const toggleIsInFavorites = async (FilmId: number) => {

  let cachedFavoriteSet = await fileCache.getItem<Set<number>>(
    "FavoritesFilm"
  );

  //in case storage was deleted
  if (!cachedFavoriteSet) {
    await initIsInFavorites();
    cachedFavoriteSet = await fileCache.getItem<Set<number>>(
      "FavoritesFilm"
    );
    if (!cachedFavoriteSet) return;
  }

  if (cachedFavoriteSet.has(FilmId)) {
    cachedFavoriteSet.delete(FilmId);
  } else {
    cachedFavoriteSet.add(FilmId);
  }

  await fileCache.setItem(
    "FavoritesFilm",
    cachedFavoriteSet
  );
}

const initIsInFavorites = async () => {
  await fileCache.setItem(
    "FavoritesFilm",
    new Set<number>()
  );
}