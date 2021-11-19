let db;
let budgetVersion;

const request = indexedDB.open('BudgetDB', 1);

request.onupgradeneeded = function (e) {
  db = e.target.result;
  const { oldVersion } = e;
  const newVersion = e.newVersion || db.version;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('BudgetStore', { autoIncrement: true });
  }
};


function checkDatabase() {
  let transaction = db.transaction(['BudgetStore'], 'readwrite');
  const store = transaction.objectStore('BudgetStore');
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            transaction = db.transaction(['BudgetStore'], 'readwrite');
            const currentStore = transaction.objectStore('BudgetStore');
            currentStore.clear();
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  db = e.target.result;
  if (navigator.onLine) {
    console.log('Backend online!');
    checkDatabase();
  }
};
  const saveRecord = (record) => {
  const transaction = db.transaction(['BudgetStore'], 'readwrite');
  const store = transaction.objectStore('BudgetStore');
  store.add(record);
};

window.addEventListener('online', checkDatabase);
