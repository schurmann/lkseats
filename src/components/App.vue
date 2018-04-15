<template>
  <div id='app' class="container-fluid">
    <div class="d-flex flex-row justify-content-center align-items-center no-select">
      <font-awesome-icon v-show="interactive" v-on:click="prevDay" class="mr-3 arrow" icon="chevron-left" size="5x"/>
      <h1 class="text-center display-1 mt-2 day">{{ currentDay | dayFormat }}</h1>
      <font-awesome-icon v-show="interactive" v-on:click="nextDay" class="ml-3 arrow" icon="chevron-right" size="5x"/>
    </div>
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
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import ShowCard from './ShowCard';

const disallowed = ['Området', 'Systemtest'];
const days = ['Friday', 'Saturday', 'Sunday'];
const interval = 10; // 15 seconds

export default {
  name: 'App',
  components: {
    ShowCard,
    FontAwesomeIcon,
  },
  data() {
    return {
      shows: [],
      currentDay: 18,
      error: false,
      interactive: process.env.NODE_ENV === 'development',
      interval,
    };
  },
  created() {
    this.fetchData();
    if (!this.interactive) this.startInterval();
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 73:
          this.interactive = !this.interactive;
          break;
        case 37:
          this.prevDay();
          break;
        case 39:
          this.nextDay();
          break;
        default:
          break;
      }
    });
  },
  filters: {
    dayFormat(val) {
      if (!val) return '';
      return days[val - 18];
    },
  },
  watch: {
    interactive(to) {
      if (to) clearInterval(this.interval);
      else this.startInterval();
    },
  },
  methods: {
    startInterval() {
      this.interval = setInterval(() => {
        this.changeDay(1);
      }, interval * 1000);
    },
    changeDay(val) {
      this.currentDay += val;
      if (this.currentDay > 20) this.currentDay = 18;
      else if (this.currentDay < 18) this.currentDay = 20;
    },
    prevDay() {
      this.changeDay(-1);
    },
    nextDay() {
      this.changeDay(1);
    },
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
.day {
  width: 400px;
}
.arrow {
  cursor: pointer;
}
.no-select {
  user-select: none;
}
</style>
