"use strict";

class App {
  constructor() {
    this.UI = {};

    'tbits,tstates,stries,sstddev,tablecontainer'.split`,`.forEach( id => {
      this.UI[id] = document.getElementById(id);
    });


    this. ztable = [
      {confidence: 50, z: 0},
      {confidence: 75, z: 0.68},
      {confidence: 90, z: 1.29},
      {confidence: 95, z: 1.65},
      {confidence: 99, z: 2.33},
      {confidence: 99.9, z: 3.09},
      {confidence: 99.99, z: 3.71}
    ];

    this.UI.tstates.onchange = () => this.calculateStates(true);
    this.UI.tbits.onchange = () => this.calculateBits();

    this.UI.tbits.value = 2;
    this.calculateBits();
  }

  calculateStates(writeBits) {
    const n = parseInt(this.UI.tstates.value);
    if (writeBits) {
      const bits = Math.log2(n);
      this.UI.tbits.value = bits.toFixed(2);
    }
 
    //TODO: increase this limit...somehow
    if (n > 134217728) {
      this.UI.stries.innerText = "ERR: too large to calculate here";
      return;
    }

    let expectedTries = 0;
    for (let i = 1; i <= n; i++) {
      expectedTries += 1 / i;
    }
    expectedTries *= n;
    this.UI.stries.innerText = expectedTries.toFixed(1);

    let variance = 0;
    for (let i = 1; i < n; i++) {
      variance += i / (n - i);
    }

    const stddev = Math.sqrt(variance);
    this.UI.sstddev.innerText = stddev.toFixed(2);

    const table = document.createElement('table');  
    
    const hr = document.createElement('tr');
    table.appendChild(hr);
    'Confidence,Expected Tries'.split`,`.forEach( title => {
      const th = document.createElement('th');
      th.innerText = title;
      hr.appendChild(th);
    });
    
    this.ztable.forEach( zobj => {
      const tr = document.createElement('tr');  
      tr.className = 'crow';
      table.appendChild(tr);
      const tdc = document.createElement('td');
      tr.appendChild(tdc);
      tdc.innerText = `${zobj.confidence}%`;
      const tde = document.createElement('td');
      tr.appendChild(tde);
      const ed = expectedTries + zobj.z * stddev;
      tde.innerText = ed.toFixed(1);
    });
    
    this.UI.tablecontainer.innerHTML = '';
    this.UI.tablecontainer.appendChild(table);  

  }

  calculateBits() {
    const bits = parseInt(this.UI.tbits.value);
    this.UI.tstates.value = Math.pow(2, bits);
    this.calculateStates(false);
  }
}

const app = new App();
