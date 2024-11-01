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

  getHarmonic(n) {
    let result;
    //if n is small, calculate directly, otherwise, use approximation
    if (n < 60) {
      result = 0;
      for (let i = 1; i <= n; i++) {
        result += 1 / i;
      }
    } else {
      const gamma = 0.5772156649 //euler-mascheroni constant
      result = (Math.log(n) + gamma);
    }
    return result;
  }  

  getExpectedTries(n) {
    //https://brilliant.org/wiki/coupon-collector-problem/
    return Math.round(this.getHarmonic(n) * n);
  }  

  getStdDev(n) {
    //https://brilliant.org/wiki/coupon-collector-problem/
    let variance;
    if (n < 60) {
      variance = 0;
      for (let i = 1; i <= n; i++) {
        variance += 1 / (i * i);
      }
      variance *= n * n;
      variance -= n * this.getHarmonic(n);
    } else {
      const gamma = 0.5772156649 //euler-mascheroni constant
      variance = (Math.PI * Math.PI * n * n / 6) - n * (Math.log(n) + gamma) - 1/2;
    }
    return Math.sqrt(variance);
  }

  calculateStates(writeBits) {
    const n = parseInt(this.UI.tstates.value);
    if (writeBits) {
      const bits = Math.log2(n);
      this.UI.tbits.value = bits.toFixed(2);
    }
 
    const expectedTries = this.getExpectedTries(n);
    this.UI.stries.innerText = expectedTries.toFixed(1);

    const stddev = this.getStdDev(n);
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
