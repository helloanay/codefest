<template>
  <v-app>
    <v-app-bar app>
      <router-link to="/">
              <v-toolbar-title class="headline text-uppercase">
        <span>Pehel</span>
        <span class="font-weight-light">India</span>
      </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view v-if="isSignedIn" :user="user" />
      <v-form v-else>
       <v-alert type="error" v-if="error">
          {error}
        </v-alert>
        <v-container>
          <v-text-field
            v-model="phoneNo"
            :rules="[v => !!v || 'Phone number is required!']"
            :counter="10"
            label="Phone Number"
            required
            :disabled="phoneNo && sentOTP"
          ></v-text-field>
          <v-text-field
            v-model="otp"
            :rules="[v => !!v || 'OTP is required!']"
            :counter="10"
            label="OTP"
            required
            v-if="sentOTP"
          ></v-text-field>

          <v-btn @click="sendOTP" :disable="sentOTP">Send OTP</v-btn>
          <v-btn @click="verifyOTP" v-if="sentOTP">Verify OTP</v-btn>
        </v-container>
      </v-form>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      isSignedIn: false,
      user: {},
      phoneNo: null,
      sentOTP: false,
      error: null,
      otp: null
    };
  },
  methods: {
    async getMe() {
      let res = await axios.get("http://localhost:3000/auth/get-me", {
        withCredentials: true
      });
      console.log(res.data);
      if (res.data.error) {
        this.isSignedIn = false;
      } else {
        this.user = res.data;
        this.isSignedIn = true;
      }
    },
    async sendOTP() {
      let res = await axios.post("http://localhost:3000/auth/get-otp", {
        phoneNo: this.phoneNo
      }, { withCredentials: true });

      const {error, data} = res;

      if (error) {
        this.error = error;
      } else {
        this.error = null;
        this.sentOTP = true;
      }
    },
    async verifyOTP() {
      let res = await axios.post("http://localhost:3000/auth/login", {
        otp: this.otp
      }, {
        withCredentials: true
      });

      if (res.data.user) {
        location.reload();
      } else {
        this.error = res.data.error;
      }
    }
  },
  async mounted() {
    await this.getMe();
  }
};
</script>
