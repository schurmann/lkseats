<template>
  <div class="card m-2 col-xl no-padding" :class="parentClass" style="width: 18rem;">
    <div class="card-body" :class="childClass" :id="`show-${show.id}`">
      <div :id="`show-${show.id}-start`"></div>
      <h4 class="card-title text-center font-weight-bold">{{show.name}}</h4>
      <div class="alert alert-warning" v-if="error">
          Network error
      </div>
      <div class="list-group list-group-flush" v-else-if="!error && performances.length">
        <PerformanceItem
        v-for="perf in performances"
        :key="perf.id"
        :performance="perf"
        :newDay="perf.newDay"
        />
      </div>
      <p v-else>No performances!</p>
      <div :id="`show-${show.id}-end`"></div>
    </div>
  </div>
</template>

<script>
import get from '../api';
import PerformanceItem from './PerformanceItem';

let scrollPos = 'end';
const scrollingShows = ['Filmen'];

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
  computed: {
    parentClass() {
      return { parent: this.shouldScroll() };
    },
    childClass() {
      return { child: this.shouldScroll() };
    },
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
            } else {
              val.newDay = false;
            }
          });
          this.performances = json;
          this.error = false;
          this.startScroll();
        })
        .catch((error) => {
          this.error = true;
          console.error(error);
          setTimeout(() => this.fetchData(), 10 * 1000);
        });
    },
    shouldScroll() {
      console.log(this.show.name, scrollingShows);
      return scrollingShows.includes(this.show.name);
    },
    startScroll() {
      if (!this.shouldScroll()) return;
      setInterval(() => {
        this.$scrollTo(`#show-${this.show.id}-${scrollPos}`, 2000, {
          container: `#show-${this.show.id}`,
          offset: -20,
        });
        scrollPos = scrollPos === 'start' ? 'end' : 'start';
      }, 5000);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.no-padding {
  padding: 0;
}

.parent {
  height: 100vh;
}

.child {
  overflow-y: scroll;
}
</style>
