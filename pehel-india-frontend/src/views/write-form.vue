<template>
	<div>
			<v-container>
					<v-alert type="error" v-if="error">
	      {{error}}
	    </v-alert>
				<v-form>
				      <v-text-field
				        disable
				        label="Location"
				        :value="`${position.coords.latitude}, ${position.coords.longitude}`"
				        required
				      ></v-text-field>
				     <v-text-field
				        disable
				        label="Description"
				        v-model="desc"
				        required
				      ></v-text-field>
				     <v-text-field
				        disable
				        label="Photo"
				        v-model="photo"
				        required
				      ></v-text-field>
				      <v-autocomplete 
				      	v-model="category"
				      	:items="items"
  		      	        :search-input.sync="search"
  		      	        cache-items
						class="mx-4"
					    flat
					    hide-no-data
					    hide-details
					    label="Category of report"
					    solo-inverted>
					    </v-autocomplete>
					    <br>
					    <v-btn @click="submit">Submit!</v-btn>
				</v-form>
			</v-container>	
	</div>
</template>

<script type="text/javascript">
import axios from "axios"
export default {
	data() {
		return {
			desc: "",
			position: {
				coords: {
					latitude: "",
					longitude: ""
				}
			},
			items: ["food", "education","children", "women", "elderly", "differently abled", "livelihood"],
			search: null,
			category: null,
			photo: null,
			error: null
		}
	},
	methods: {
		async submit(e) {
			e.preventDefault();
			const form = { desc: this.desc, location: [this.position.coords.latitude, this.position.coords.longitude], photo: this.photo, category: this.category};

			const res = await axios.post("http://localhost:3000./report", form, {
				withCredentials: true
			});

			if (res.data.error) {
				this.error = res.data.error

			} else {
				this.$router.push("/report")
			}
		}
	},
	mounted() {
		navigator.geolocation.getCurrentPosition(pos => {
			this.position = pos;
		})

	}
}

</script>

<style type="text/css"></style>