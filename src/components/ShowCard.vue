<template>
  <div class="card m-2 col-xl no-padding" style="width: 18rem;">
    <div class="card-body">
      <h4 class="card-title font-weight-bold">{{show.name}}</h4>
      <div class="alert alert-warning" v-if="error">
          Network error
      </div>
      <div class="list-group list-group-flush" v-else-if="!error && performances.length">
        <PerformanceItem
        v-for="perf in performances"
        :key="perf.id"
        :performance="perf"
        :visible="perf.start.getDate() === day"
        />
      </div>
      <p v-else>No performances!</p>
    </div>
  </div>
</template>

<script>
import get from '../api';
import PerformanceItem from './PerformanceItem';

export default {
  name: 'ShowCard',
  components: {
    PerformanceItem,
  },
  props: {
    show: {
      type: Object,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      performances: [],
      error: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      get(`/shows/${this.show.id}/performances`)
        .then((json) => {
          json.forEach((val) => {
            val.start = new Date(val.start);
          });
          this.performances = json;
        })
        .catch(() => {
          this.error = true;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.no-padding {
  padding: 0;
}
</style>
