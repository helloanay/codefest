<template>
  <div>
  	<v-container>
		<v-card @click="$router.push('/report')" class="white--text" style="background: #f00; min-height: 130px;">
			<div style="min-height: 30px;"></div>
			<p  style="text-align: center; font-size: 40px;">REPORT</p>
		</v-card>
		<v-card @click="$router.push('/news')" class="white--text" style="background: green; min-height: 130px;">
			<div style="min-height: 30px;"></div>
			<p style="text-align: center; font-size: 40px;">NEWS</p>
		</v-card>
  	</v-container>
  </div>
</template>

<script>
export default {

};
</script>
