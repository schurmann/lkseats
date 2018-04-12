<template>
  <div class="list-group-item">
    <div v-if="performance.newDay" class="text-center h4">
      {{ performance.start | day }}
    </div>
    <div class="alert alert-warning" v-if="error">
      Network error
    </div>
    <CodeLoader v-else-if="loading"/>
    <div v-else class="d-flex flex-row justify-content-around h5 no-margin">
      <span>{{ performance.start | time }}</span>
      <div :class="seatsClass(seats)" class="font-weight-bold text-primary">
        {{seats}}
      </div>
    </div>
  </div>
</template>

<script>
import { CodeLoader } from 'vue-content-loader';
import moment from 'moment';
import get from '../api';

const totalSeats = (performance) =>
  Object.values(performance).reduce((total, val) => total + val.available, 0);
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
export default {
  name: 'PerformanceItem',
  props: {
    performance: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      categories: {},
      seats: -1,
      error: false,
      newDay: '',
      updated: false,
      loading: true,
    };
  },
  components: { CodeLoader },
  filters: {
    day(value) {
      if (!value) return '';
      return moment(value).format('dddd');
    },
    time(value) {
      if (!value) return '';
      return moment(value).format('H:mm');
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    setTimeout(() => {
      setInterval(() => {
        this.updatePerformance();
      }, 30 * 1000);
    }, randomInt(0, 60) * 1000);
  },
  methods: {
    seatsClass(seats) {
      return {
        'text-warning': seats > 5 && seats <= 20,
        'text-danger': seats <= 5,
        'animated infinite shake': this.updated,
      };
    },
    fetchData() {
      get(`/performances/${this.performance.id}`)
        .then((json) => {
          this.categories = json.availability;
          this.seats = totalSeats(this.categories);
        })
        .catch(() => {
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updatePerformance() {
      get(`/performances/${this.performance.id}`).then((json) => {
        this.seats = totalSeats(json.availability);
        this.updated = true;
        setInterval(() => {
          this.updated = false;
        }, 1000);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import 'animate.css/animate.css';
.list-group-item {
  padding: 10px 0;
}
.no-margin {
  margin: 0;
}
</style>
