<template>
  <div class="list-group-item" v-show="visible">
    <div class="alert alert-warning" v-if="error">
      Network error
    </div>
    <code-loader v-else-if="loading"/>
    <div v-else class="d-flex flex-row justify-content-around h3 no-margin">
      <span>{{ performance.start | time }}</span>
      <div :class="[seatsClass(seats), {'text-primary': seats > 20}]" class="font-weight-bold">
        {{seats}}
      </div>
    </div>
  </div>
</template>

<script>
import { CodeLoader } from 'vue-content-loader';
import moment from 'moment';

const totalSeats = (performance) =>
  Object.values(performance).reduce((total, val) => total + val.available, 0);

export default {
  name: 'PerformanceItem',
  components: { CodeLoader },
  props: {
    performance: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      categories: {},
      seats: -1,
      error: false,
      loading: true,
    };
  },
  filters: {
    time(value) {
      if (!value) return '';
      return moment(value).format('H:mm');
    },
  },
  created() {
    this.fetchData();
  },
  watch: {
    visible(newVal) {
      if (newVal) this.fetchData();
    },
  },
  methods: {
    seatsClass(seats) {
      return {
        'text-warning': seats > 5 && seats <= 20,
        'text-danger': seats <= 5,
      };
    },
    fetchData() {
      const vm = this;
      this.$get(`/performances/${this.performance.id}`)
        .then((json) => {
          vm.categories = json.availability;
          vm.seats = totalSeats(vm.categories);
          vm.error = false;
        })
        .catch(() => {
          vm.error = true;
        })
        .finally(() => {
          vm.loading = false;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-group-item {
  padding: 10px 0;
}
.no-margin {
  margin: 0;
}
</style>
