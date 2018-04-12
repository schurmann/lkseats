<template>
  <div class="card m-2 col-xl no-padding" style="width: 18rem;">
    <div class="card-body">
      <h4 class="card-title text-center font-weight-bold">{{show.name}}</h4>
      <div class="alert alert-warning" v-if="error">
          Network error
      </div>
      <div class="list-group list-group-flush" v-else-if="!error && performances.length">
        <PerformanceItem
        v-for="perf in performances"
        :key="perf.id"
        :performance="perf"
        :visible="true"
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
          // Some performances from shows are in reverse order...
          json.sort((p1, p2) => p1.start - p2.start);
          json.forEach((val, idx) => {
            val.start = new Date(val.start);
            if (
              idx === 0 ||
              json[idx - 1].start.getHours() > val.start.getHours()
            ) {
              val.newDay = true;
            }
          });
          this.performances = json;
        })
        .catch((error) => {
          this.error = true;
          console.error(error);
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
