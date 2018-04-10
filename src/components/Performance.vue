<template>
  <div class="list-group-item" v-show="visible">
    <h5 class="mb-1">{{ performance.start | date }}</h5>
    <div class="alert alert-warning" v-if="error">
      Network error
    </div>
    <div v-else>
      <p class="mb-1 text-primary"
      v-for="cat in categories"
      :key="cat.id"
      :class="seatsClass(cat)">
      {{cat.name}}: {{cat.available}}
      </p>
    </div>
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
  filters: {
    date(value) {
      if (!value) return '';
      return moment(value).format('dddd H:mm');
    },
  },
  data() {
    return {
      categories: [],
      error: false,
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
  methods: {
    seatsClass(category) {
      return {
        'text-warning': category.available > 5 && category.available <= 20,
        'text-danger': category.available <= 5,
      };
    },
    fetchData() {
      get(`/performances/${this.performance.id}`)
        .then((json) => {
          this.categories = json.availability;
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
.list-group-item {
  padding: 10px 0;
}
</style>
