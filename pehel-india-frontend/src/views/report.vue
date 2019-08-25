<template>
  <div class="about">
  	<v-container>
  		<v-layout>
  			<v-flex @click="$router.push('/report/write')" :xs6="user.type === 'ngo-owner'" :xs12="user.type !== 'ngo-owner'">
  				<v-card style="min-height: 80px; text-align: center; background:" class="white--text war">
  				<div style="min-height: 25px;"></div>
  				Write a Report
  			</v-card>
  			</v-flex>
 			<v-flex xs6 v-if="user.type === 'ngo-owner'">
  				<v-card style="min-height: 80px; text-align: center; background:" class="white--text war">
  				<div style="min-height: 25px;"></div>
  				Check Nearby Reports For The NGO!
  			</v-card>
  			</v-flex>
  		</v-layout>
  		<v-layout>
                        <v-flex xs12>
        <v-list>

        
            <v-list-item v-for="(item, idx) in items.docs" :key="item.id" @click="">

                  <v-list-item-content>
                    <v-list-item-title>{{idx+1}}. Category: {{item.category.name}}, Description: {{item.desc}}, Created At: {{new Date(item.createdAt).toString().slice(7, 20)}} </v-list-item-title>
                  </v-list-item-content>

            </v-list-item>
          
        </v-list> 
                      </v-flex>       
      </v-layout>
  	</v-container>
  </div>
</template>
<style type="text/css">
	.war {
	  background: #06beb6; /* fallback for old browsers */
	  background: -webkit-linear-gradient(to right, #06beb6, #48b1bf); /* Chrome 10-25, Safari 5.1-6 */
	  background: linear-gradient(to right, #06beb6, #48b1bf); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

	}
</style>

<script type="text/javascript">
  import axios from 'axios';
	export default {
	props: ["user"],
    data() {
      return {
        items: []
      }
    },
    methods: {
      async getReports() {
        let res = await axios.get("http://localhost:3000/get-my-reports?limit=20&page=1", { withCredentials: true });

        this.items = res.data;
      }
    },
    mounted() {
      this.getReports();
    }
	}
</script>