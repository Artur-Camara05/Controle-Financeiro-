const Storage = {
    key: 'finance_transactions',

    get() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    },

    set(transactions) {
        localStorage.setItem(this.key, JSON.stringify(transactions));
    },

    add(transaction) {
        const transactions = this.get();
        transactions.unshift(transaction);
        this.set(transactions);
    },

    remove(id) {
        const transactions = this.get().filter(t => t.id !== id);
        this.set(transactions);
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};
