<template>
  <div id='app' class="container-fluid">
    <div class="alert alert-warning mt-5" v-if="error">
      Network error
    </div>
    <div class="row align-items-start" v-else>
        <ShowCard
          v-for="show in shows"
          :key="show.id"
          :show="show"
        />
    </div>
  </div>
</template>


<script>
import get from '../api';
import ShowCard from './ShowCard';

const disallowed = ['Området'];

export default {
  name: 'App',
  components: {
    ShowCard,
  },
  data() {
    return {
      shows: [],
      currentDay: 18,
      error: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      get('/shows')
        .then((json) => {
          this.shows = json.filter((show) => !disallowed.includes(show.name));
        })
        .catch(() => {
          this.error = true;
        });
    },
  },
};
</script>

<style style lang="scss">
@import '../../styles/custom.scss';
@import '../../node_modules/bootstrap/scss/bootstrap.scss';
</style>
