<template>
	<q-item clickable :to="isExternal ? undefined : link" tag="a" :href="isExternal ? link : undefined"
		:target="isExternal ? '_blank' : undefined" color="red">
		<q-item-section v-if="icon" avatar>
			<q-icon :name="icon" color="red" />
		</q-item-section>

		<q-item-section>
			<q-item-label class="text-black">{{ title }}</q-item-label>
		</q-item-section>
	</q-item>
</template>


<script>
	import { defineComponent, computed } from 'vue'

	export default defineComponent({
		name: 'EssentialLink',
		props: {
			title: { type: String, required: true },
			caption: { type: String, default: '' },
			link: { type: String, default: '#' },
			icon: { type: String, default: '' },
		},
		setup(props) {
			// Define se o link é externo (começa com "http" ou "https")
			const isExternal = computed(() => props.link.startsWith('http'))

			return { isExternal }
		},
	})
</script>
