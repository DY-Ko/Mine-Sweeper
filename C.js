let dataset = [];
let tbody = document.querySelector('#table tbody');
let gameend = false;
let opencell = 0;
window.document.onselectstart = new Function("return false");
window.document.ondragstart = new Function("return false");


document.querySelector('#exec').addEventListener('click', function() {

tbody.innerHTML='';
document.querySelector('#result').textContent = '';
dataset = [];
opencell = 0;
gameend = false;
// 데이터셋 , tbody모두 매 게임마다 리셋

  let hor = parseInt(document.querySelector('#hor').value);
  let ver = parseInt(document.querySelector('#ver').value);
  let mine = parseInt(document.querySelector('#mine').value);

//랜덤으로 숫자 뽑는법 기억해두면 좋다
// array , fill , map 콤보
  let candidate = Array(hor * ver).fill().map(function (factor, index) {
      return index;
  });

    console.log('candidate', candidate);  

  let shuffle = [];

  while(candidate.length > (hor * ver) - mine) {
  //   let random = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
  //   shuffle.push(random);
  // }

  

  
    let random = Math.floor(Math.random() * candidate.length);
    let spliceArray = candidate.splice(random, 1);
    let value = spliceArray[0];
    shuffle.push(value); 
  }
    console.log('shuffle', shuffle)


//지뢰테이블 만들기
  
  for (let i = 0; i < ver; i++ ) {
    let arr = [];
    let tr = document.createElement('tr');
    dataset.push(arr);
    for(let j = 0; j< hor; j++ ) {
      arr.push(0);
      let td = document.createElement('td');

      td.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (gameend) {
          return;
        }
        let prenttr = e.currentTarget.parentNode;
        let prenttbody = e.currentTarget.parentNode.parentNode;
        let colcell = Array.prototype.indexOf.call(prenttr.children, e.currentTarget);
        let rowcell = Array.prototype.indexOf.call(prenttbody.children, prenttr);
        if (e.currentTarget.textContent === '' || e.currentTarget.textContent === 'X'){
          e.currentTarget.textContent = '🚩';
        } else if (e.currentTarget.textContent === '🚩') {
          e.currentTarget.textContent = '?';
        } else if (e.currentTarget.textContent === '?') {
          if (dataset[rowcell][colcell] === 'X') {
            e.currentTarget.textContent = 'X';
          } else {
            e.currentTarget.textContent = '';
          }
        }
        
        
      });

      
      td.addEventListener('click', function (e) {
        if (gameend) {  
          return;            
        }
        
        let parenttr = e.currentTarget.parentNode;
        let parenttbody = e.currentTarget.parentNode.parentNode;
        let colcell = Array.prototype.indexOf.call(parenttr.children, e.currentTarget);
        let rowcell = Array.prototype.indexOf.call(parenttbody.children, parenttr);

        if(dataset[rowcell][colcell] === 1) {
          return;
        }

        e.currentTarget.classList.add('opened')
        opencell += 1
        // classList 가 여기 td에 접근하는거고 opened 클래스가 생김

        if (dataset[rowcell][colcell] === 'X') {
          e.currentTarget.textContent = '펑';
          document.querySelector('#result').textContent = '실패 ㅠㅠ'
          gameend = true;
        


        } else if (opencell === hor * ver - mine && dataset[rowcell][colcell] !== 'X') {
          gameend = true;
          document.querySelector('#result').textContent = '승리 ^^';
          
        


        } else {
          
          dataset[rowcell][colcell] = 1;
          let around = [
                      dataset[rowcell][colcell-1], dataset[rowcell][colcell+1]
                      ];

          if (dataset[rowcell-1]){
            around = around.concat( dataset[rowcell-1][colcell-1], dataset[rowcell-1][colcell], dataset[rowcell-1][colcell+1] );
          }
          if (dataset[rowcell+1]){
            around = around.concat( dataset[rowcell+1][colcell-1], dataset[rowcell+1][colcell], dataset[rowcell+1][colcell+1] );
          }
          
          let mineNum = around.filter(function(v) {
            return v == 'X';}).length;


          // 거짓인 값 : falst, '' , 0, null, undefined 거짓인 값이면 || 뒤에걸써라
          e.currentTarget.textContent = mineNum || '';
          if (mineNum === 0){
          // 주변 8칸 모두 오픈 (반복문 or 재귀) 재귀함수 반복문 역할 가능
          // 재귀: 반복문을 함수로 표현하는 방법
            let surround = [
              tbody.children[rowcell].children[colcell-1],
              tbody.children[rowcell].children[colcell+1],
            ];
            if (tbody.children[rowcell-1]){
              surround = surround.concat([
                tbody.children[rowcell-1].children[colcell-1],
                tbody.children[rowcell-1].children[colcell],
                tbody.children[rowcell-1].children[colcell+1],
              ]);
            }
            if (tbody.children[rowcell+1]){
              surround = surround.concat([
                tbody.children[rowcell+1].children[colcell-1],
                tbody.children[rowcell+1].children[colcell],
                tbody.children[rowcell+1].children[colcell+1],
              ]);
            }
            surround.filter(function(v) {
              return !!v;
            }).forEach(function(next) {
              let parenttr = next.parentNode;
              let parenttbody = next.parentNode.parentNode;
              let nextcolcell = Array.prototype.indexOf.call(parenttr.children, next);
              let nextrowcell = Array.prototype.indexOf.call(parenttbody.children, parenttr);
              if (dataset[nextrowcell][nextcolcell] !== 1){
                next.click();
              }
            });
            
          }            
        }
      });

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }


//지뢰 심기
  for (let k=0; k<shuffle.length; k++) {
    let col = Math.floor(shuffle[k] / ver);
    let row = shuffle[k] % hor;
    
    tbody.children[col].children[row].textContent = 'X';
    dataset[col][row] = 'X';
  }
  // console.log(dataset);

});

