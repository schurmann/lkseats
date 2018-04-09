<template>
  <div class="list-group-item">
    <h5 class="mb-1">{{date(performance)}}</h5>
    <p class="mb-1 text-primary"
     v-for="cat in categories"
     :key="cat.id"
     v-bind:class="seatsClass(cat)">
     {{cat.name}}: {{cat.ticketCount}}
     </p>
  </div>
</template>

<script>
import moment from 'moment';
import get from '../api';

export default {
  props: {
    performance: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      categories: [],
    };
  },
  created: function() {
    this.fetchData();
  },
  mounted: function() {
    setInterval(() => {
      this.fetchData();
      console.log('hello');
    }, 1000 * 30);
  },
  methods: {
    seatsClass: function(category) {
      return {
        'text-warning': category.ticketCount && category.ticketCount <= 20,
        'text-danger': !category.ticketCount,
      };
    },
    date: function(performance) {
      return moment(performance.start).format('dddd HH:MM');
    },
    fetchData: function() {
      get(`/public/shows/${this.performance.show.id}/categories`).then(
        (json) => {
          this.categories = json;
        }
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-group-item {
  padding: 10px 0;
}
</style>
