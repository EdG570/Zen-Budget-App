<template>
    <div class="transactions">
        <div class="container">
            <div class="row">
                <div class="col-sm transactions-header">
                    <h2>TRANSACTIONS</h2>
                    <router-link to="/dashboard" class="dashboard-link">Dashboard</router-link>
                </div>
            </div>
            <div class="row">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Total</th>
                            <th>Notes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="transaction in pagedTransactions" :key="transaction._id">
                            <td>{{ transaction.date }}</td>
                            <td>{{ transaction.categoryName }}</td>
                            <td>{{ transaction.type }}</td>
                            <td class="total-column">${{ transaction.total }}</td>
                            <td>{{ transaction.note }}</td>
                            <td>
                                <span class="link edit-link">Edit</span>
                                <span class="link void-link">Void</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <pagination :data="transactions" @pageChanged="changePage"></pagination>
            </div>
        </div>
    </div>    
</template>

<script>
import { mapState } from 'vuex'
import * as moment from 'moment' 
import Pagination from '../components/Pagination'

export default {
    name: 'Transactions',
    components: {
        Pagination
    },
    data() {
        return {
            transactions: [],
            pagedTransactions: []
        }
    },
    computed: {
        ...mapState([
            'variableExpenses'
        ])
    },
    methods: {
        sortTransactionsDescByDate(transactions) {
            return transactions.sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })
        },
        getAllTransactions() {
            let transactions = []

            console.log(this.variableExpenses)

            this.variableExpenses.categories.forEach(category => {
                category.transactions.forEach(transaction => {
                    transaction.categoryName = category.name
                    transactions.push(transaction)
                })
            })

            let sortedTransactions = this.sortTransactionsDescByDate(transactions)

            sortedTransactions.forEach(transaction => {
                transaction.date = moment(transaction.date).format("ddd, MMM Do YYYY")
            })

            this.transactions = sortedTransactions
        },
        changePage(indexRange) {
            console.log('PAGE CHANGED')
            this.pagedTransactions = []

            for (var i = indexRange.lower; i <= indexRange.upper; i++) {
                this.pagedTransactions.push(this.transactions[i])
            }
        }
    },
    created() {
        this.getAllTransactions()
        this.changePage({ lower: 0, upper: 9})
    }
}
</script>

<style scoped>
    .transactions {
        padding-top: 2.5em;
    }

    table.table {
        background-color: #242B51;
    }

    table tr td {
        font-weight: 200;
        color: #ddd;
        font-size: 12px;
    }

    table tr th {
        font-weight: 300;
        background-color: rgba(110, 37, 85, 0.2);
        color: #fff;
    }

    .total-column {
        color: #DC1B59;
    }

    table .table-striped tr {
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
    }

    h2 {
        font-size: 1.4em;
        letter-spacing: 2px;
        margin-bottom: 1em;
        display: inline-block;
        width: fit-content;
    }

    .dashboard-link {
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

    .dashboard-link:hover {
        color: #fff;
        background-color: #DC1B59;
        transition: all 0.25s linear;
        text-decoration: none;
    }

    .transactions-header {
        position: relative;
    }

    .link {
        border-radius: 5px;
        padding: 0.15em 0.5em;
        cursor: pointer;
        margin-left: 0.35em;
        margin-right: 0.35em;
        transition: all 0.25s linear;
    }

    .link:hover {
        transition: all 0.25s linear;
        color: #fff;
    }

    .edit-link {
        color: #2985f5;
        border: 1px solid #2985f5;   
    }

    .edit-link:hover {    
        background-color: #2985f5;    
    }

    .void-link {
       color: #ff2d50;
       border: 1px solid #ff2d50;  
    }

    .void-link:hover {
        background-color: #ff2d50;
    }

    .pagination {
        border: 1px solid #fff;
    }
    .page-item {
    }
</style>
