<template>
    <div class="pagination-container">
        <span class="first" @click="decrementPage">Prev</span>
        <span v-for="page in numberPages" :key="page" @click="pageClicked(page)" :class="currentPage == page ? 'active' : ''">{{ page }}</span>
        <span class="last" @click="incrementPage">Next</span>
    </div>
</template>

<script>
export default {
   name: 'Pagination',
   data() {
       return {
           numberPages: [],
           currentPage: 1,
           upperIndex: 9,
           lowerIndex: 0
       }
   },
   props: {
      data: Array
   },
   methods: {
       determineNumberPages() {
           this.numberPages = []
           let length = this.data.length

           if (length <= 10) {
               this.numberPages.push[1]
               return
           }

           let maxPages = Math.ceil(length / 10)

           for (var i = 0; i < maxPages; i++) {
               this.numberPages.push(i + 1)
           }
       },
       pageClicked(page) {
           this.currentPage = page
           this.getUpperIndex(page)
       },
       getUpperIndex(page) {
           console.log(page)
           let upper = (page * 10) - 1
           let lower = upper - 9

           if (upper > this.data.length) {
               this.upperIndex = this.data.length - 1
               this.lowerIndex = (page * 10) - 10
           } 
           else {
               this.upperIndex = upper
               this.lowerIndex = lower
           }

           console.log('LOWER: ' + this.lowerIndex, 'UPPER: ' + this.upperIndex)

           this.$emit('pageChanged', { upper: this.upperIndex, lower: this.lowerIndex })
       },
       incrementPage() {
           if (this.currentPage == this.numberPages.length) return
           this.currentPage++
           this.getUpperIndex(this.currentPage)
       },
       decrementPage() {
           if (this.currentPage == 1) return
           this.currentPage--
           this.getUpperIndex(this.currentPage)
       }
   },
   created() {
       this.determineNumberPages()
   } 
}

</script>

<style scoped>
    .pagination-container {
        display: inline-block;
        width: fit-content;
        margin: 0 auto;
        margin-top: 1em;
    }

    span {
        border: 1px solid #fff;
        padding: 0.5em 1em;
        cursor: pointer;
    }

    .first {
        border-radius: 5px 0 0 5px;
    }

    .last {
        border-radius: 0 5px 5px 0;
    }

    .active {
        background-color: cornflowerblue;
    }
</style>
