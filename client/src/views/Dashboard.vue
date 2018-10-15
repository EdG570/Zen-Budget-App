<template>
    <div class="dashboard">
        <div class="container">
            <div class="row">
                <div class="col-sm dashboard-header">
                    <h2>DASHBOARD</h2>
                    <router-link to="/transactions" class="transactions-link">Transactions</router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-lg order-lg-1 order-2">
                    <div class="list-group">
                        <button type="button" class="list-group-item list-group-item-action header" :key="fixedExpenses._id">
                            Fixed Expenses
                            <img src="../assets/plus.svg" data-toggle="modal" data-target="#newFixedExpenseModal" title="Add new fixed expense" alt="Add icon">
                        </button>
                        <button type="button" 
                                class="list-group-item list-group-item-action"
                                v-for="category in fixedExpensesList.categories"
                                :key="category._id"
                        >
                            {{ category.name }}
                            <span class="money">{{ category.budget | currency }}</span>
                            <div class="slide">
                                <div class="toggle"></div>
                                <div class="action-box">
                                    <img src="../assets/pencil-edit-button.svg" 
                                         class="icon icon-edit"
                                         @click="setExpenseName(category.name, category._id, category.budget, null)" 
                                         data-toggle="modal" 
                                         data-target="#expenseEditModal" 
                                         title="Edit" 
                                         alt="Edit Icon"
                                    >
                                    <img src="../assets/delete.svg" 
                                         class="icon icon-remove" 
                                         @click="setExpenseName(category.name, category._id, null, 'fixed')" 
                                         data-toggle="modal" 
                                         data-target="#expenseEndModal" 
                                         title="Remove" 
                                         alt="Cancel Icon"
                                    >
                                </div>
                            </div>
                        </button>
                        <button type="button" class="list-group-item list-group-item-action header">
                            Total: <span class="money">{{ getFixedExpenseTotal | currency }}</span>
                        </button>
                    </div>
                </div>
                <div class="col-lg order-lg-2 order-3">
                    <div class="total-cont">
                        Total Income: <span class="money green">{{ 2842 | currency}}</span>
                    </div>
                    <div class="total-cont">
                        Total Expenses: <span class="money">{{ getFixedExpenseTotal + getVariableExpenseTotal | currency }}</span>
                    </div>
                    <div class="total-cont">
                        Budget Space: <span class="money green">{{ 2842 - (getFixedExpenseTotal + getVariableExpenseTotal) | currency }}</span>
                    </div>
                </div>
                <div class="col-lg order-lg-3 order-1">
                    <div class="list-group">
                        <button type="button" class="list-group-item list-group-item-action header">
                            Variable Expenses
                            <img src="../assets/plus.svg" data-toggle="modal" data-target="#newVariableExpenseModal" title="Add new fixed expense" alt="Add icon">
                        </button>
                        <button type="button" 
                                class="list-group-item list-group-item-action"
                                v-for="cat in variableCategoryTotals"
                                :key="cat.id"
                        >
                            {{ cat.name }}
                            <span class="money">{{ cat.total | currency }}</span>
                            <meter min="0" max="100" high="80" :value="cat.percentOfBudget" :title="cat.percentOfBudget + '% of $' + cat.budget + ' Budget'"></meter>
                            <div class="slide">
                                <div class="toggle"></div>
                                <div class="action-box">
                                    <img src="../assets/plus.svg" 
                                         class="icon icon-create"
                                         @click="setCategoryInfo(cat.id, cat.name)"
                                         data-toggle="modal" 
                                         data-target="#newVarTranModal" 
                                         title="Add new transaction" 
                                         alt="Add icon"
                                    >
                                    <img src="../assets/pencil-edit-button.svg" 
                                         class="icon icon-edit"
                                         @click="setExpenseName(cat.name, cat.id, cat.budget, null)" 
                                         data-toggle="modal" 
                                         data-target="#expenseEditModal" 
                                         title="Edit" 
                                         alt="Edit Icon"
                                    >
                                    <img src="../assets/delete.svg" 
                                         class="icon icon-remove" 
                                         @click="setExpenseName(cat.name, cat.id, null, 'variable')" 
                                         data-toggle="modal" 
                                         data-target="#expenseEndModal" 
                                         title="Remove" 
                                         alt="Cancel Icon"
                                    >
                                </div>
                            </div>
                        </button>
                        <button type="button" class="list-group-item list-group-item-action header">
                            Total: <span class="money">{{ getVariableExpenseTotal | currency }}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="row graph-cont">
                <div class="col-4">
                    <pie-chart></pie-chart>
                </div>
                <div class="col-8">
                    <div class="line-chart">
                        <h5 class="line-chart-header">Previous Week Variable Expenses</h5>
                        <line-chart :data="setLineChartWeeklyData"></line-chart>
                    </div>
                </div>
            </div>
        </div>
        <fixed-expense-modal @newExpenseReady="createNewFixedExpense"></fixed-expense-modal>
        <variable-expense-modal @newVariableExpenseReady="createNewVariableExpense"></variable-expense-modal>
        <create-var-tran-modal @newVarTranReady="createNewVarTran" :categoryName="categoryName"></create-var-tran-modal>
        <expense-end-modal @endExpense="endThisExpense" 
                           :expenseName="expenseName" 
                           :expenseId="expenseId"
        >
        </expense-end-modal>
        <expense-edit-modal @editExpenseReady="editExpenseReady" 
                            :expenseName="expenseName" 
                            :expenseId="expenseId" 
                            :expenseBudget="expenseBudget"
        >
        </expense-edit-modal>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import FixedExpenseModal from '@/components/FixedExpenseModal'
import ExpenseEndModal from '@/components/ExpenseEndModal'
import ExpenseEditModal from '@/components/ExpenseEditModal'
import VariableExpenseModal from '@/components/NewVariableExpenseModal'
import CreateVarTranModal from '@/components/createVarTranModal'
import LineChart from '@/components/LineChart'
import PieChart from '@/components/PieChart'

import * as moment from 'moment' 

export default {
    name: 'Dashboard',
    components: {
        FixedExpenseModal,
        ExpenseEndModal,
        ExpenseEditModal,
        VariableExpenseModal,
        CreateVarTranModal,
        LineChart,
        PieChart
    },
    data() {
        return {
            expenseName: '',
            expenseId: '',
            expenseBudget: 0,
            expenseGroup: '',
            categoryId: '',
            categoryName: '',
            lineChartData: [],
            fixedExpensesList: [],
            variableExpensesList: []
        }
    },
    computed: {
        ...mapGetters([
            'getFixedExpenseTotal',
            'getVariableExpenseTotal',
            'variableCategoryTotals'
        ]),
        ...mapState([
            'fixedExpenses',
            'variableExpenses'
        ]),
        setLineChartWeeklyData() {
            let chartData = [ ['Sun', 0], ['Mon', 0], ['Tue', 0], ['Wed', 0], ['Thu', 0], ['Fri', 0], ['Sat', 0] ]
            let dateRange = this.getDateRange()

            this.variableExpenses.categories.forEach(cat => {
                cat.transactions.forEach(tran => {    
                    if (moment(tran.date).toDate() >= dateRange.firstDay && moment(tran.date).toDate() <= dateRange.lastDay) {
                        switch (moment(tran.date).toDate().getDay()) {
                            case 0:
                                chartData[0][1] += tran.total
                                break;
                            case 1:
                                chartData[1][1] += tran.total
                                break;
                            case 2:
                                chartData[2][1] += tran.total
                                break;
                            case 3:
                                chartData[3][1] += tran.total
                                break;
                            case 4:
                                chartData[4][1] += tran.total
                                break;
                            case 5:
                                chartData[5][1] += tran.total
                                break;
                            case 6:
                                chartData[6][1] += tran.total
                        }
                    }
                })
            })
           
            return chartData
        }
    },
    methods: {
        ...mapActions([
            'getAll',
            'createFixedExpense',
            'endExpense',
            'editFixedExpense',
            'createVariableExpense',
            'createVariableTransaction'
        ]),
        getDateRange() {
           let firstDayPrevWeek = moment().day(-7).toDate()
           let lastDayPrevWeek = moment().day(-1).toDate()

           return { firstDay: firstDayPrevWeek, lastDay: lastDayPrevWeek }
        },
        createNewFixedExpense(expense) {
            expense.groupId = this.fixedExpenses._id
            expense.token = localStorage.getItem('token')
            this.createFixedExpense(expense)
        },
        createNewVarTran(expense) {
            expense.id = this.categoryId
            expense.token = localStorage.getItem('token')
            this.createVariableTransaction(expense)
        },
        createNewVariableExpense(expense) {
            expense.groupId = this.variableExpenses._id
            expense.token = localStorage.getItem('token')
            this.createVariableExpense(expense)
        },
        endThisExpense(expense) {
            expense.token = localStorage.getItem('token')
            expense.group = this.expenseGroup
            console.log(expense)
            this.endExpense(expense)
        },
        setExpenseName(name, id, budget, group) {
            this.expenseName = name
            this.expenseId = id
            console.log(id)
            if (budget) this.expenseBudget = budget
            if (group) this.expenseGroup = group
        },
        setCategoryInfo(id, name) {
            this.categoryId = id
            this.categoryName = name
        },
        editExpenseReady(expense) {
            expense.token = localStorage.getItem('token')
            this.editFixedExpense(expense)
        }
    },
    created() {
        const body = { token: localStorage.getItem('token') }
        this.getAll(body)
    },
    watch: {
        fixedExpenses(fresh, old) {
            this.fixedExpensesList = fresh
        },
        variableExpenses(fresh, old) {
            this.variableExpensesList = fresh
        }
    }
}
</script>

<style scoped>
    .dashboard {
        padding-top: 1.5em;
    }

    .list-group button {
        background-color: #242B51;
        color: #ddd;
        font-weight: 100;
        letter-spacing: 1px;
        font-size: 12px;
    }

    button.list-group-item {
        position: relative;
        overflow: hidden;
    }

    .list-group button:active, .list-group button:hover {
        outline: none !important;
        border: none;
        box-shadow: none;
    }

    .list-group .header {
        font-weight: 500;
        color: #fff;
        font-size: 16px;
    }

    .trend {
        background-color: #242B51;
    }

    .graph-cont {
        padding-top: 1em;
    }

    .money {
        position: absolute;
        right: 30px;
        color: #DC1B59;
    }

    .green {
        color:chartreuse;
    }

    .total-cont {
        background-color: #242B51;
        padding: 2em 1em;
        border-radius: 5px;
        margin-bottom: 0.75em;
        font-size: 1.2em;
    }

    meter {
        border-radius: 5px;
        width: 10em;
    }

    h2 {
        font-size: 1.4em;
        letter-spacing: 2px;
        margin-bottom: 1em;
        display: inline-block;
        width: fit-content;
    }

    .header img {
        float: right;
        width: 1.25em;
    }

    .header img:hover {
        cursor: pointer;
    }

    .action-box {
        position: relative;
    }

    .action-box .icon {
        width: 1.15em;
        cursor: pointer;
        position: absolute;
    }

    .icon-remove {
        right: 0.75em;
        top: 0.95em;
    }

    .icon-edit {
        right: 2.8em;
        top: 0.95em;
    }

    .slide {
        position: absolute;
        background: #DC1B59;
        width: 56px; 
        right: -56px;
        top: 0;
        bottom: 0;
        transition: right 0.4s ease-in-out;
        -o-transition: right 0.4s ease-in-out;
        -ms-transition: right 0.4s ease-in-out;
        -moz-transition: right 0.4s ease-in-out;
        -webkit-transition: right 0.4s ease-in-out;
    }

    .toggle {
        position: absolute;
        top: -5px;
        right: 56px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 25px 7px 25px 0;
        border-color: transparent #F7FFF7 transparent transparent;
        line-height: 0px;
        _border-color: #000000 #F7FFF7 #000000 #000000;
        _filter: progid:DXImageTransform.Microsoft.Chroma(color='#000000');
    }

    .slide:hover {
        right: 0;
    }

    .line-chart {
        background-color: #242B51;
        padding: 1em;
        min-height: 25em;
        max-height: 25em;
        overflow: hidden;
        border-radius: 5px;
    }

    .line-chart-header {
        text-align: center;
        letter-spacing: 2px;
        font-weight: 200;
    }

    .transactions-link {
        color: #DC1B59;
        border: 1px solid #DC1B59;
        border-radius: 5px;
        padding: 0.5em 1em;
        font-weight: 200;
        transition: all 0.25s linear;
        position: absolute;
        right: 1em;
        bottom: 1em;
    }

    .transactions-link:hover {
        color: #fff;
        background-color: #DC1B59;
        transition: all 0.25s linear;
        text-decoration: none;
    }

    .dashboard-header {
        position: relative;
    }
</style>


