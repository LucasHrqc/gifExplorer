<template>
  <div class="flex-row bg-gray-200 justify-center items-center min-h- color-black pt-12">

    <div v-if="isRequesting" class="flex justify-center items-start">
      <div class="grid grid-cols-4 gap-4 m-4">
        <div v-for="index in 24" :key="index">
          <q-skeleton type="QRange" :loading="isRequesting" :animated="isRequesting" :repeat="5" width="400px"
            height="300px" />
        </div>
      </div>
    </div>

    <div v-else-if="!noResults" class="flex justify-center items-start">
      <q-infinite-scroll @load="infiniteScroll" :offset="50" class="q-pa-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="(gif, index) in gifs" :key="index" transition="fade">
            <q-card flat class="q-ma-sm hover:cursor-pointer rounded-xl">
              <q-tooltip>
                Click to open preview.
              </q-tooltip>
              <img :src="gif.images.downsized_large.url" class="w-full h-48 sm:h-64 md:h-72 object-cover"
                style="width: 380px; height: 300px;" @click="selectImage(gif)">
            </q-card>
          </div>
        </div>
        <template v-slot:loading>
          <div class="flex justify-center items-center q-my-md">
            <q-spinner-dots color="white" size="40px"></q-spinner-dots>
          </div>
        </template>
        <div v-if="endResults" class="flex justify-center items-center text-black pt-12">
          <span>No more results.</span>
        </div>
      </q-infinite-scroll>
    </div>

    <div v-else class="flex justify-center items-center">
      <div class="white text-black">No results were found for: "{{ search }}"</div>
    </div>
  </div>

  <q-dialog v-model="displayDialog">
    <q-card class="bg-gray-950 text-white rounded-md w-full h-fit" style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <img :src="selectedGif.images.original.url" class="w-full h-48 sm:h-64 md:h-72 object-fit rounded-md"
          style="width: 700px; height: 500px;">
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import {
  ref, Ref
} from 'vue';

const emit = defineEmits(['infiniteScroll']);

const props = defineProps<{
  gifs: Array<object>,
  search?: string,
  isRequesting: boolean,
  noResults: boolean,
  endResults: boolean
}>();

const displayDialog: Ref<boolean> = ref(false);
const selectedGif: Ref<object> = ref({});
const selectImage = (gif: object) => {
  displayDialog.value = true;
  selectedGif.value = gif;
}
const infiniteScroll = (index: any, done: any) => {
  if (!props.endResults) {
    setTimeout(() => {
      emit('infiniteScroll');
      done();
    }, 1000);
  } else {
    done();
  }
}

</script>
