<template>
  <div id='app' class="container-fluid">
    <h1 class="text-center display-1 mt-2">{{ currentDay | dayFormat }}</h1>
    <div class="alert alert-warning mt-5" v-if="error">
      Network error
    </div>
    <div class="row align-items-start justify-content-center" v-else>
        <ShowCard
          v-for="show in shows"
          :key="show.id"
          :show="show"
          :currentDay="currentDay"
        />
    </div>
  </div>
</template>


<script>
import ShowCard from './ShowCard';

const disallowed = ['Området'];
const days = ['Friday', 'Saturday', 'Sunday'];
const interval = 15; // 15 seconds

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
    setInterval(() => {
      this.currentDay += 1;
      if (this.currentDay > 20) this.currentDay = 18;
    }, interval * 1000);
  },
  filters: {
    dayFormat(val) {
      if (!val) return '';
      return days[val - 18];
    },
  },
  methods: {
    fetchData() {
      const vm = this;
      this.$get('/shows')
        .then((json) => {
          vm.shows = json.filter((show) => !disallowed.includes(show.name));
          vm.error = false;
        })
        .catch((error) => {
          vm.error = true;
          console.error(error);
          setTimeout(() => vm.fetchData(), 10 * 1000);
        });
    },
  },
};
</script>

<style lang="scss">
@import '../../styles/custom.scss';
@import '../../node_modules/bootstrap/scss/bootstrap.scss';
</style>
