<template>
  <div class="flex justify-center items-start text-black">
    <div class="text-white flex flex-center items-center w-10/12 md:w-4/12">
      <q-input outlined type="text" v-model="textProp" @update:model-value="onChange" @keydown.enter="onSearch"
        label="Enter your search" rounded :input-style="{ width: '100%', margin: '5px' }" style="width: 100%;" label-color="black">
        <template v-slot:append>
          <q-btn v-if="textProp" round flat dense icon="close" size="md" color="black" @click="clearSearch">
            <q-tooltip>
              clean the search text.
            </q-tooltip>
          </q-btn>
          <q-btn round flat icon="search" color="black" @click="onSearch">
            <q-tooltip>
              Click here to search, or press enter.
            </q-tooltip>
          </q-btn>
        </template>
      </q-input>
    </div>
  </div>

  <q-dialog v-model="invalidSearchString" position="top">
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          <div class="text-h4">Error</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          Please, insert a valid string on search field.
        </q-card-section>
      </q-card>
    </q-dialog>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

const emit = defineEmits(['onChange', 'onSearch'])
const invalidSearchString: Ref<boolean> = ref(false);
const textProp: Ref<string> = ref('');
const clearSearch = () => {
  textProp.value = '';
}

const onChange = () => {
  if (textProp.value) {
    emit('onChange', textProp.value);
  }
};

const onSearch = () => {
  if (textProp.value) {
    invalidSearchString.value = false;
    emit('onSearch');
  } else {
    invalidSearchString.value = true;
  }
};
</script>