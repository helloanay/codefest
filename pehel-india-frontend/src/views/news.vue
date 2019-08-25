<template>
  <div>
    <h2 style="text-align: center;">NEWS</h2>
    <v-row justify="center">
      <v-dialog v-model="modal" scrollable max-width="600px">
        <v-card>
          <v-card-title class="headline">{{el.type}} - {{el.title}}</v-card-title>
          <v-card-text v-html="el.body"></v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-container>
      <v-list>
        <v-list-item v-for="(item, idx) in news.docs" :key="item.id">
                  <v-list-item-content>
                    <v-list-item-title @click="el = item; modal = true;">{{idx+1}}. {{el.type}} - {{ item.title }}</v-list-item-title>
                  </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ["user"],
  data() {
    return {
      news: [],
      modal: false,
      el: {
        title: null,
        body: null,
        publishedBy: {
          name: null
        },
        type: null
      }
    }
  },
  methods: {
    async getNews() {
      let res = await axios.get('http://localhost:3000/updates', { withCredentials: true });
      this.news = res.data;
    }
  },
  async mounted() {
    await this.getNews();
  }
};
</script>

<style>
</style>
