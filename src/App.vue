<template>
  <div id='app' class="container">
    <div class="row align-items-start">
        <Card
          v-for="show in shows"
          :key="show.id"
          :show="show"
          :day="currentDay"
        />
    </div>
  </div>
</template>


<script>
import get from './api';
import Card from './components/Card';

export default {
  name: 'App',
  components: {
    Card,
  },
  data() {
    return {
      shows: [],
      currentDay: 18,
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    setInterval(() => {
      this.currentDay += 1;
      if (this.currentDay > 20) this.currentDay = 18;
    }, 10 * 1000);
  },
  methods: {
    fetchData() {
      get('/shows').then((json) => {
        this.shows = json;
      });
    },
  },
};
</script>

<style style lang="scss">
@import '../styles/custom.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
