<template>
  <div class="flex-row justify-center items-center text-white">
    <div class="flex-col justify-center items-center h-full w-full"
      style="background: url(https://images.unsplash.com/photo-1596367407372-96cb88503db6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80) no-repeat bottom; background-size:cover; filter: brightness(90%);">

      <div class="flex justify-center items-center p-32 pt-72 text-black">
        <span class="text-4xl mr-2">Search Gifs</span>
        <span class="text-sm">(powered by <a class="text-sm text-blue" href="https://giphy.com/" target="_blank">giphy.com
            <q-tooltip>
              Go to giphy website.
            </q-tooltip>
          </a>, made by <a class="text-sm text-blue" href="https://github.com/LucasHrqc" target="_blank">lucashrqc<q-tooltip>
              Go to lucashrqc's github.
            </q-tooltip>
          </a>)</span>
      </div>

      <SearchBarComponent @onChange="onChange" @onSearch="searchTriggered"></SearchBarComponent>

      <div class="flex justify-center items-center p-14 lowercase">
        <q-btn no-caps flat size="md" color="black" label="" @click="handleTrendingClick">Trending
          <q-tooltip>
            View the trending gifs.
          </q-tooltip>
        </q-btn>
      </div>
    </div>


    <GifsCardComponent ref="gifsCard" :gifs="isTrending ? store.getTrendingGifs : store.getSearchGifs"
      :no-results="noResults" :end-results="endResults" @infiniteScroll="infiniteScrollRequest"
      :is-requesting="isRequesting" :search="searchString">
    </GifsCardComponent>
  </div>
  <router-view />
</template>


<script setup lang="ts">

import SearchBarComponent from 'src/components/SearchBarComponent.vue';
import GifsCardComponent from 'src/components/GifsCardComponent.vue';
import { ref, computed, onMounted, Ref } from 'vue';
import { useGifStore } from 'src/stores/gif-store';
import { api } from 'boot/axios';

onMounted(() => {
  fetchGifs();
});

const gifsCard = ref(null);

const store = useGifStore();

// Variables that dictates screen behavior.
const isTrending: Ref<boolean> = ref(false);
const isRequesting: Ref<boolean> = ref(false);
const noResults: Ref<boolean> = ref(false);
const endResults: Ref<boolean> = ref(false);
const invalidSearchString: Ref<boolean> = ref(false);


const searchString: Ref<string> = computed(() => store.getSearchString);
const searchGifs = computed(() => store.getSearchGifs);
const trendingGifs = computed(() => store.getTrendingGifs);
const pagination: Ref<object> = ref({});

const fetchGifs = (isInfiniteScroll: boolean | null = null) => {

  isTrending.value = !searchString.value ? true : false;
  isRequesting.value = !isInfiniteScroll;
  const offsetValue = isTrending.value ? trendingGifs.value.length : searchGifs.value.length;
  const route = isTrending.value ? 'https://api.giphy.com/v1/gifs/trending' : 'https://api.giphy.com/v1/gifs/search';
  const apiKey = process.env.GIPHY_API_KEY;
  const response = api.get(route, {
    params: {
      api_key: apiKey,
      q: searchString.value,
      limit: 16,
      offset: offsetValue,
    },
  });

  response
    .then((success) => {
      const data = success.data.data;
      noResults.value = !(data.length > 0);
      if (isTrending.value) {
        store.updateSearchGifs([]);
        store.updateTrendingGifs([...trendingGifs.value, ...data])
      } else {
        store.updateTrendingGifs([]);
        store.updateSearchGifs([...searchGifs.value, ...data]);
      }
      pagination.value = success.data.pagination;
    })
    .catch((failure) => {
      reset();
      console.error('Something went wrong with the gif request', failure);
    })
    .finally(() => {
      isRequesting.value = false;
    });
};

const infiniteScrollRequest = () => {
  const gifsLength = searchGifs.value.length > 0 ? searchGifs.value.length : trendingGifs.value.length;
  if (!isRequesting.value && pagination.value.total_count > gifsLength) {
    endResults.value = false;
    fetchGifs(true);
  } else {
    endResults.value = true;
  }
};

const onChange = (text: string) => {
  store.updateSearchString(text);
  if (!text && noResults.value) {
    endResults.value = false;
    isTrending.value = true;
    fetchGifs();
  }
};

const searchTriggered = () => {
  store.updateSearchGifs([]);
  endResults.value = false;
  if (searchString.value) {
    fetchGifs();
  } else {
    invalidSearchString.value = true;
  }
};

const handleTrendingClick = () => {
  store.updateSearchString('');
  isTrending.value = true;
  endResults.value = false;
  fetchGifs();
};

const reset = () => {
  store.resetState();
};
</script>
