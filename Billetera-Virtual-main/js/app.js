// Selectores
const balance = document.getElementById('balance');
const transactionList = document.getElementById('transactionList');
const modalIngresar = document.getElementById('modalIngresar');
const modalTransferir = document.getElementById('modalTransferir');
const btnsCancelar = document.querySelectorAll('.cerrar-modal');
const btnIngresar = document.getElementById('btnIngresar');
const btnTransferir = document.getElementById('btnTransferir');
const btnHistorial = document.getElementById('btnHistorial');
const btnConfirmarIngreso = document.getElementById('confirmarIngreso');
const btnConfirmarTransferencia = document.getElementById('confirmarTransferencia');
const currencySelector = document.getElementById('currencySelector');
// Funciones
const openModal = modal => modal.style.display = 'block';
const closeModal = modal => modal.style.display = 'none';
const getTransactions = () => JSON.parse(localStorage.getItem('transactions')) || [];
const validarMonto = monto => monto > 0 
const validarTransferencia = monto => parseFloat(getBalance()) >= parseFloat(monto)
const validarDestinationario = destinatario => destinatario.trim().length > 2
const showHistory = () => {
const transactions = getTransactions();
    const transactionsContainer = document.querySelector('.transaction-container');
    transactionsContainer.innerHTML = '';
    transactions.forEach(transaction => {
        transactionsContainer.innerHTML += `
            <div class="transaction-item">
                <p>${transaction.type === 'ingreso' ? '⬇' : '⬆'} $${transaction.monto} </p>
                <p>${transaction.destintario}</p>
            </div>
        `
    })
}
const ingresarDinero = monto => {
    localStorage.setItem('balance', parseFloat(getBalance()) + parseFloat(monto));
    const transactions = getTransactions()
    transactions.push({
        type: 'ingreso',
        monto: parseFloat(monto),
        destintario: 'Billetera Virtual',
    })
    localStorage.setItem('transactions', JSON.stringify(transactions))
    showHistory();
}
const transferirDinero = (monto, destinatario) => {
    localStorage.setItem('balance', parseFloat(getBalance()) - parseFloat(monto));
    const transactions = getTransactions()
    transactions.push({
        type: 'transferencia',
        monto: parseFloat(monto),
        destintario: destinatario,
    })
    localStorage.setItem('transactions', JSON.stringify(transactions))
    showHistory();
}
const getBalance = () => localStorage.getItem('balance') || 0;
const updateBalance = () => {
    balance.innerHTML = `$ ${getBalance()}`
}

window.addEventListener('DOMContentLoaded', () => {
    updateBalance()
    closeModal(transactionList)
    // Eventos
    btnsCancelar.forEach(btn => 
        btn.addEventListener('click', () => {
            modalIngresar.style.display = 'none'
            modalTransferir.style.display = 'none'
        })
    );
    btnIngresar.addEventListener('click', () => openModal(modalIngresar))
    btnTransferir.addEventListener('click', () => openModal(modalTransferir))
    btnHistorial.addEventListener('click', () => {
        if (transactionList.style.display === 'none') {
            openModal(transactionList);
            showHistory();
        } else 
            closeModal(transactionList);
    })
    btnConfirmarIngreso.addEventListener('click', () => {
        const montoIngreso = document.getElementById('montoIngreso').value;
        if (validarMonto(montoIngreso)) {
            ingresarDinero(montoIngreso);
            updateBalance()
            modalIngresar.style.display = 'none';        
        } else alert('El monto ingresado no es válido');
        document.getElementById('montoIngreso').value = '';
    })
    btnConfirmarTransferencia.addEventListener('click', () => {
        const montoTransferencia = document.getElementById('montoTransferencia').value;
        const destinatario = document.getElementById('destinatario').value;
        if (validarMonto(montoTransferencia) && validarTransferencia(montoTransferencia) && validarDestinationario(destinatario)) {
            transferirDinero(montoTransferencia, destinatario);
            updateBalance()
            modalTransferir.style.display = 'none';
        } else alert('Los datos ingresados no son válidos');
        document.getElementById('montoTransferencia').value = '';
        document.getElementById('destinatario').value = '';
    })
    currencySelector.addEventListener('change', async () => {
        /* fetch('./data/conversion.json')
            .then(data => data.json())
            .then(conversion => {
                const rates = conversion.rates;
                const currency = currencySelector.value;
                localStorage.setItem('currency', currency);
                balance.innerHTML = `$ ${getBalance() * (currency === 'ARS' ? 1 : rates[currency])}`;
            }) */
        const data = await fetch('./data/conversion.json');
        const conversion = await data.json();
        const rates = conversion.rates;
        const currency = currencySelector.value;
        localStorage.setItem('currency', currency);
        balance.innerHTML = `$ ${(getBalance() * (currency === 'ARS' ? 1 : rates[currency])).toFixed(2)}`;
    })
})