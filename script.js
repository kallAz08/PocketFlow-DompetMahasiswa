// DATA TRANSAKSI
let transactions = [
    { id: 1, title: "Proyek freelance", category: "Freelance", date: "04 Okt 2026", amount: 2000000, type: "income", icon: "▱" },
    { id: 2, title: "Belanja kebutuhan", category: "Belanja", date: "04 Okt 2026", amount: 1000000, type: "expense", icon: "▢" },
    { id: 3, title: "Belanja bulanan", category: "Makanan", date: "03 Okt 2026", amount: 800000, type: "expense", icon: "♧" },
    { id: 4, title: "Makan & kopi", category: "Makanan", date: "03 Okt 2026", amount: 200000, type: "expense", icon: "♧" },
    { id: 5, title: "Transportasi", category: "Transportasi", date: "02 Okt 2026", amount: 400000, type: "expense", icon: "♧" },
    { id: 6, title: "Listrik & internet", category: "Tagihan", date: "02 Okt 2026", amount: 600000, type: "expense", icon: "ϟ" },
    { id: 7, title: "Sewa tempat tinggal", category: "Tempat tinggal", date: "01 Okt 2026", amount: 2000000, type: "expense", icon: "⌂" },
    { id: 8, title: "Gaji Oktober", category: "Gaji", date: "01 Okt 2026", amount: 8000000, type: "income", icon: "▣" }
];

let filter = "all";

function rupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}

function totalIncome() {
    let total = 0;
    // untuk mengitung pemasukanya
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type == "income") {
            total += transactions[i].amount;
        }
    }
    return total;
}

function totalExpense() {
    let total = 0;
    // ini untuk menghitung pengeluaranya
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type == "expense") {
            total += transactions[i].amount;
        }
    }
    return total;
}

// menggunakan local storage jadi biar datanya tersempan
function saveData() {
    localStorage.setItem(
        "pocketflowTransactions",
        JSON.stringify(transactions)
    );
}
let dataTersimpan = localStorage.getItem("pocketflowTransactions");
// untuk mengambilnya lagi data yg sdh tersimpan
if (dataTersimpan) {
    transactions = JSON.parse(dataTersimpan);
}
function updateDashboard() { // untuk dasbortnya
    let income = totalIncome();
    let expense = totalExpense();
    document.getElementById("incomeValue").innerText =
        rupiah(income);
    document.getElementById("expenseValue").innerText =
        rupiah(expense);
    document.getElementById("balanceValue").innerText =
        rupiah(income - expense);
    let incomeCount = 0;
    let expenseCount = 0;
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type == "income") {
            incomeCount++;
        }
        if (transactions[i].type == "expense") {
            expenseCount++;
        }
    }
    document.getElementById("incomeCount").innerText =
        incomeCount + " transaksi pemasukan";
    document.getElementById("expenseCount").innerText =
        expenseCount + " transaksi pengeluaran";
    document.getElementById("totalCount").innerText =
        transactions.length + " transaksi";
    document.getElementById("historyIncome").innerText =
        rupiah(income);
    document.getElementById("historyExpense").innerText =
        rupiah(expense);
    document.getElementById("historyCountLabel").innerText =
        transactions.length + " dari " + transactions.length + " transaksi";
}
function showRecent() {
    let html = ""; // untuk transaksinya
    for (let i = 0; i < 4 && i < transactions.length; i++) {
        let t = transactions[i];
        let tanda = "+";
        let jenis = "Pemasukan";
        if (t.type == "expense") {
            tanda = "−";
            jenis = "Pengeluaran";
        }
        html += `
            <div class="recent-row">
                <div class="tx-icon ${t.type}">
                    ${t.icon}
                </div>
                <div>
                    <div class="tx-name">
                        ${t.title}
                    </div>
                    <div class="tx-meta">
                        ${t.category} · ${t.date}
                    </div>
                </div>
                <div class="tx-money ${t.type}">
                    ${tanda} ${rupiah(t.amount)}
                    <div class="tx-type">
                        ${jenis}
                    </div>
                </div>
            </div>
        `;
    }
    document.getElementById("recentList").innerHTML = html;
    document.querySelector(".list-footer span").innerText =
        transactions.length + " transaksi tercatat di Oktober";
}
function showHistory() {
// untuk menampilkan riwayatnyaini
    let keyword =
        document.getElementById("searchInput").value.toLowerCase();
    let html = "";
    let jumlah = 0;
    for (let i = 0; i < transactions.length; i++) {
        let t = transactions[i];
        let cocokFilter =
            filter == "all" || t.type == filter;
        let teks =
            (t.title + " " + t.category).toLowerCase();
        let cocokSearch =
            teks.includes(keyword);
        if (cocokFilter && cocokSearch) {
            jumlah++;
            let tanda = "+";
            let jenis = "Pemasukan";
            if (t.type == "expense") {
                tanda = "−";
                jenis = "Pengeluaran";
            }
            html += `
                <div class="history-item">
                    <div class="tx-icon ${t.type}">
                        ${t.icon}
                    </div>
                    <div class="details">
                        <div class="tx-name">
                            ${t.title}
                        </div>
                        <div class="tx-meta">
                            ${t.category} · ${t.date}
                        </div>
                    </div>
                    <div class="money ${t.type}">
                        ${tanda} ${rupiah(t.amount)}
                        <div class="tx-type">
                            ${jenis}
                        </div>
                    </div>
                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${t.id})">
                        ♙ &nbsp; Hapus
                    </button>
                </div>
            `;
        }
    }
    document.getElementById("historyList").innerHTML = html;
    document.getElementById("historyCountLabel").innerText =
        jumlah + " dari " + transactions.length + " transaksi";
    if (jumlah == 0) {
        document.getElementById("emptyMessage").style.display = "block";
    } else {
        document.getElementById("emptyMessage").style.display = "none";
    }
}
function deleteTransaction(id) {
// untuk menghapus transaksinya
    let dataBaru = [];
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].id != id) {
            dataBaru.push(transactions[i]);
        }
    }
    transactions = dataBaru;
    saveData();
    refresh();
}
document.getElementById("transactionForm").addEventListener( // menambah transakyna
    "submit",
    function(event) {
        event.preventDefault();
        let title =
            document.getElementById("title").value;
        let amount =
            Number(document.getElementById("amount").value);
        let type =
            document.getElementById("type").value;
        if (title == "" || amount <= 0) {
            return;
        }
        let newTransaction = {
            id: Date.now(),
            title: title,
            category: type == "income" ? "Pemasukan" : "Lainnya",
            date: "04 Okt 2026",
            amount: amount,
            type: type,
            icon: type == "income" ? "↗" : "□"
        };
        transactions.unshift(newTransaction);
        saveData();
        document.getElementById("transactionForm").reset();
        refresh();
        alert("Transaksi berhasil ditambahkan!");
    }
);

document.getElementById("searchInput").addEventListener(
    "input",// untuk serachingnya
    function() {
        showHistory();
    }
);

let filterButtons = // untuk memfilternya
    document.querySelectorAll(".filter");
for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener(
        "click",
        function() {
            for (let j = 0; j < filterButtons.length; j++) {
                filterButtons[j].classList.remove("active");
            }
            this.classList.add("active");
            filter =
                this.getAttribute("data-filter");
            showHistory();
        }
    );
}

let navigation =
    document.querySelectorAll("[data-page]");
for (let i = 0; i < navigation.length; i++) {
    navigation[i].addEventListener( // navigasinya ini 
        "click",
        function() {
            let page =
                this.getAttribute("data-page");
            let pages =
                document.querySelectorAll(".page");
            for (let j = 0; j < pages.length; j++) {
                pages[j].classList.remove("active-page");
            }
            document
                .getElementById(page)
                .classList.add("active-page");
            let nav =
                document.querySelectorAll(".nav-item");
            for (let j = 0; j < nav.length; j++) {
                nav[j].classList.remove("active");
                if (
                    nav[j].getAttribute("data-page") == page
                ) {
                    nav[j].classList.add("active");
                }
            }
            window.scrollTo(0, 0);
        }
    );
}
function refresh() {// refhres datanya ini
    updateDashboard();
    showRecent();
    showHistory();
}
refresh(); // untuk menjalankan web nya