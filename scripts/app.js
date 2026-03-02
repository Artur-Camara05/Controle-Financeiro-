class FinanceApp {
    constructor() {
        this.transactions = Storage.get();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.render();
    }

    cacheElements() {
        this.modal = document.getElementById('transactionModal');
        this.form = document.getElementById('transactionForm');
        this.openModalBtn = document.getElementById('openModalBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.transactionsList = document.getElementById('transactionsList');
        this.totalBalance = document.getElementById('totalBalance');
        this.totalIncome = document.getElementById('totalIncome');
        this.totalExpense = document.getElementById('totalExpense');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    bindEvents() {
        this.openModalBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.form.reset();
        document.body.style.overflow = '';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.querySelector('input[name="type"]:checked').value;

        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
            date: new Date().toISOString()
        };

        Storage.add(transaction);
        this.transactions = Storage.get();
        this.render();
        this.closeModal();
    }

    handleFilter(e) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderTransactions();
    }

    handleDelete(id) {
        Storage.remove(id);
        this.transactions = Storage.get();
        this.render();
    }

    getFilteredTransactions() {
        if (this.currentFilter === 'all') return this.transactions;
        return this.transactions.filter(t => t.type === this.currentFilter);
    }

    calculateTotals() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            income,
            expense,
            balance: income - expense
        };
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    }

    renderBalance() {
        const { income, expense, balance } = this.calculateTotals();
        this.totalBalance.textContent = this.formatCurrency(balance);
        this.totalIncome.textContent = this.formatCurrency(income);
        this.totalExpense.textContent = this.formatCurrency(expense);
    }

    renderTransactions() {
        const filtered = this.getFilteredTransactions();
        
        if (filtered.length === 0) {
            this.transactionsList.innerHTML = `
                <div class="empty-state">
                    <p>💰 Nenhuma transação registrada</p>
                </div>
            `;
            return;
        }

        this.transactionsList.innerHTML = filtered.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-info">
                    <div class="transaction-description">
                        ${transaction.type === 'income' ? '💚' : '❤️'} ${transaction.description}
                    </div>
                    <div class="transaction-date">${this.formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount">
                    <div class="transaction-value ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'} ${this.formatCurrency(transaction.amount)}
                    </div>
                    <button class="delete-btn" onclick="app.handleDelete(${transaction.id})">×</button>
                </div>
            </div>
        `).join('');
    }

    render() {
        this.renderBalance();
        this.renderTransactions();
    }
}

const app = new FinanceApp();
