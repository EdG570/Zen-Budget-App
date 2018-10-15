<template>
    <div class="line-chart">
        <area-chart :data="data"
                    :colors="colors"
                    :messages="messages"
        >
        </area-chart>
    </div>
</template>

<script>
export default {
    data() {
        return {
            colors: ['rgba(220, 27, 89, 0.4)'],
            messages: { empty: 'No data' }
        }
    },
    props: {
        data: Array
    }    
}
</script>

<style>

</style>

