<template>
  <div id='app' class="container-fluid">
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

const disallowed = ['Karneveljen', 'Uppropsfesten', 'Systemtest', 'Området'];
export default {
  name: 'App',
  components: {
    Card,
  },
  data: function data() {
    return {
      shows: [],
      currentDay: 18,
    };
  },
  created: function created() {
    this.fetchData();
  },
  mounted: function mounted() {
    setInterval(() => {
      this.currentDay += 1;
      if (this.currentDay > 20) this.currentDay = 18;
    }, 300 * 1000);
  },
  methods: {
    fetchData: function fetchData() {
      get('/public/shows').then((json) => {
        this.shows = json.filter((show) => !disallowed.includes(show.name));
      });
    },
  },
};
</script>

<style style lang="scss">
@import '../styles/custom.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
