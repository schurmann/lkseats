<template>
  <div class="list-group-item" v-show="visible">
    <h5 class="mb-1">{{date}}</h5>
    <p class="mb-1 text-primary"
     v-for="cat in categories"
     :key="cat.id"
     :class="seatsClass(cat)">
     {{cat.name}}: {{cat.available}}
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
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      categories: [],
    };
  },
  created() {
    if (this.visible) this.fetchData();
  },
  watch: {
    visible(newVal) {
      if (newVal) this.fetchData();
    },
  },
  computed: {
    date() {
      return moment(this.performance.start).format('dddd H:mm');
    },
  },
  methods: {
    seatsClass(category) {
      return {
        'text-warning': category.available > 5 && category.available <= 20,
        'text-danger': category.available <= 5,
      };
    },
    fetchData() {
      get(`/performances/${this.performance.id}`).then((json) => {
        this.categories = json.availability;
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
</style>
