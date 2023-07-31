import { defineStore } from 'pinia';


export const useGifStore = defineStore('gifStore', {
  state: () => ({
    searchString: '',
    searchGifs: [] as any[],
    trendingGifs: [] as any[],
  }),
  getters: {
    getSearchString(): string {
      return this.searchString;
    },
    getSearchGifs(): any[] {
      return this.searchGifs;
    },
    getTrendingGifs(): any[] {
      return this.trendingGifs;
    },
  },
  actions: {
    resetState() {
      this.$reset();
    },
    updateSearchString(searchString: string) {
      this.searchString = searchString;
    },
    updateSearchGifs(newGifs: any) {
      this.searchGifs = newGifs;
    },
    updateTrendingGifs(newGifs: any) {
      this.trendingGifs = newGifs;
    }
  },
});
