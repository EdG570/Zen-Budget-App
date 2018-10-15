<template>
    <div class="pie-chart">
        <h5>Previous Week Expense Breakdown</h5>
        <div class="row chart-nav">
            <button @click="setActive('groups')" :class="pieChartIsGroups ? ['btn', 'btn-sm', 'active-btn'] : ['btn', 'btn-sm']">Groups</button>
            <button @click="setActive('fixed')" :class="pieChartIsFixed ? ['btn', 'btn-sm', 'active-btn'] : ['btn', 'btn-sm']">Fixed</button>
            <button @click="setActive('variable')" :class="pieChartIsVariable ? ['btn', 'btn-sm', 'active-btn'] : ['btn', 'btn-sm']">Variable</button>
        </div>
        <div class="row">
            <pie-chart 
                :data="data"
                :max="2845"
                :colors="colors"
                donut="true"
                :library="{ animation: { animateRotate: true }, cutoutPercentage: 50, segmentShowStroke: false }"
                :legend="false"
                messages="messages"
            >
            </pie-chart>                           
        </div>                     
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    data() {
        return {
            colors: ['rgba(220, 27, 89, 0.6)', 'chartreuse', '#e37344', '#f6d56f', 'teal', '#A31630', 'purple'],
            messages: { empty: 'No data' },
            pieChartIsGroups: true,
            pieChartIsFixed: false,
            pieChartIsVariable: false,
            messages: { empty: 'No data' },
            data: [],
            selected: 'groups'
        }
    },
    computed: {
        ...mapGetters([
            'getFixedExpenseTotal',
            'getVariableExpenseTotal'
        ]),
        ...mapState([
            'fixedExpenses',
            'variableExpenses'
        ])
    },
    methods: {
        setData() {
            if (this.selected == 'groups') {
                this.data = [['Fixed Expenses', this.getFixedExpenseTotal.toFixed(2)], ['Variable Expenses', this.getVariableExpenseTotal.toFixed(2)]]
            }
            else if (this.selected == 'fixed') {
                let data = []
                this.fixedExpenses.categories.forEach(cat => {
                    let total = 0
                    total += cat.budget
                    data.push([cat.name, total.toFixed(2)])
                })

                this.data = data
            }
            else if (this.selected == 'variable') {
                let data = []
                this.variableExpenses.categories.forEach(cat => {
                    let total = 0
                    cat.transactions.forEach(tran => {
                        total += tran.total
                    })
                    data.push([cat.name, total.toFixed(2)])
                })

                this.data = data
            }
        },
        setActive(name) {
            if (name == 'groups') {
                this.pieChartIsGroups = true
                this.pieChartIsFixed = false
                this.pieChartIsVariable = false
                this.selected = 'groups'
            }
            else if (name == 'fixed') {
                this.pieChartIsGroups = false
                this.pieChartIsFixed = true
                this.pieChartIsVariable = false
                this.selected = "fixed"
            }
            else if (name == 'variable') {
                this.pieChartIsGroups = false
                this.pieChartIsFixed = false
                this.pieChartIsVariable = true
                this.selected = 'variable'
            }

            this.setData()
        }
    },
    mounted() {
        this.setData()
    }
}
</script>

<style scoped> 
    .chart-nav button {
        margin: 0 0.5em;
        padding: 0.25em 0.5em;
        font-size: 10px;
        width: 5em;
        background: none;
        color: #fff;
    }

    .chart-nav button.active-btn {
        background: #DC1B59;
        color: #fff;
    }

    .pie-chart {
        background-color: #242B51;
        padding: 1em;
        min-height: 25em;
        max-height: 25em;
        overflow: hidden;
        border-radius: 5px;
    }

     .chart-nav {
        width: 58%;
        margin: 0 auto 1em auto;
    }

    h5 {
        font-weight: 200;
        text-align: center;
    }
</style>

