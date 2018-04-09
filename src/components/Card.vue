<template>
  <div class="card m-2 col-xl no-padding" style="width: 18rem;">
    <div class="card-body">
      <h4 class="card-title font-weight-bold">{{show.name}}</h4>
      <div class="list-group list-group-flush" v-if="performances.length">
        <Performance
        v-for="perf in performances"
        v-show="filterOnDay(perf)"
        :key="perf.id"
        :performance="perf"
        />
      </div>
      <p v-else>No performances!</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import get from '../api';
import Performance from './Performance';

export default {
  components: {
    Performance,
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
  data: function data() {
    return {
      performances: [],
    };
  },
  created: function created() {
    this.fetchData();
  },
  methods: {
    date: function date(performance) {
      const d = new Date(performance.start);
      return moment(d).format('dddd hh:MM');
    },
    filterOnDay: function filterOnDay(performance) {
      return performance.start.getDate() === this.day;
    },
    fetchData: function fetchData() {
      get(`/public/shows/${this.show.id}/performances`).then((json) => {
        json.forEach((val) => {
          val.start = new Date(val.start);
        });
        this.performances = json;
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
