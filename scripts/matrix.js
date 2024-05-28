document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
  
    const matrixA = document.getElementById("matrixA");
    const inputGrid = matrixA.querySelector(".input-grid");
    const resultDiv = document.querySelector("#display .result");
    const matrixSizeInput = document.getElementById("matrixSizeInput");
    const decreaseSizeBtn = document.getElementById("decreaseSize");
    const increaseSizeBtn = document.getElementById("increaseSize");
  
    if (!matrixA || !inputGrid || !resultDiv || !matrixSizeInput || !decreaseSizeBtn || !increaseSizeBtn) {
      console.error("Some elements not found");
      return;
    }
  
    let matrixSize = parseInt(matrixSizeInput.value, 10); 
  
    function createMatrixGrid(size) {
      console.log(`Creating a ${size}x${size} matrix grid`);
      matrixSize = size; 
      matrixSizeInput.value = size; 
      inputGrid.innerHTML = '';
  
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const input = document.createElement("input");
          input.type = "text"; 
          input.classList.add("matrix-input");
          input.setAttribute("data-row", i);
          input.setAttribute("data-col", j);
  
          input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9-]/g, ''); 
            if (value.includes('-')) {
                value = '-' + value.replace(/-/g, ''); 
            }
            const numericValue = parseInt(value, 10);
            if (numericValue < 0) {
                if (value.length > 3) {
                    value = value.slice(0, 3);
                }
            } else {
                if (value.length > 2) {
                    value = value.slice(0, 2);
                }
            }
            e.target.value = value;
          });
  
          inputGrid.appendChild(input);
        }
        inputGrid.appendChild(document.createElement("br"));
      }
    }
  
    function randomizeMatrixGrid() {
      const inputs = inputGrid.querySelectorAll("input.matrix-input");
      inputs.forEach(input => {
        const randomValue = Math.floor(Math.random() * 21) - 10;
        input.value = randomValue;
      });
    }
  
    function getMatrix() {
      const matrix = [];
      for (let i = 0; i < matrixSize; i++) {
        const row = [];
        for (let j = 0; j < matrixSize; j++) {
          const input = inputGrid.querySelector(`input[data-row='${i}'][data-col='${j}']`);
          row.push(Number(input.value) || 0);
        }
        matrix.push(row);
      }
      return matrix;
    }
  
    function displayResult(result) {
      resultDiv.innerHTML = `<pre>${result}</pre>`;
    }
  
    // Function to calculate the determinant of a matrix
    function determinantMatrix(matrix) {
      if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      }
  
      let det = 0;
      for (let i = 0; i < matrix.length; i++) {
        const subMatrix = matrix.slice(1).map(row => row.filter((_, colIndex) => colIndex !== i));
        det += matrix[0][i] * determinantMatrix(subMatrix) * (i % 2 === 0 ? 1 : -1);
      }
      return det;
    }
  
    createMatrixGrid(matrixSize);
  
    matrixSizeInput.addEventListener("change", (e) => {
      const size = parseInt(e.target.value, 10);
      if (size >= 1 && size <= 10) {
        createMatrixGrid(size);
      }
    });
  
    decreaseSizeBtn.addEventListener("click", () => {
      if (matrixSize > 2) {
        matrixSize--;
        matrixSizeInput.value = matrixSize; 
        createMatrixGrid(matrixSize); 
        matrixSizeInput.dispatchEvent(new Event('change')); 
      }
    });
  
    increaseSizeBtn.addEventListener("click", () => {
      if (matrixSize < 10) {
        matrixSize++;
        matrixSizeInput.value = matrixSize; 
        createMatrixGrid(matrixSize); 
        matrixSizeInput.dispatchEvent(new Event('change')); 
      }
    });
  
    const resetBtn = matrixA.querySelector(".reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        console.log("Reset button clicked");
        const inputs = inputGrid.querySelectorAll("input.matrix-input");
        inputs.forEach(input => {
          input.value = ''; 
        });
      });
    }
  
    const randomizeBtn = matrixA.querySelector(".randomize-btn");
    if (randomizeBtn) {
      randomizeBtn.addEventListener("click", () => {
        console.log("Randomize button clicked");
        randomizeMatrixGrid();
      });
    }
  
    const determinantBtn = document.querySelector("#determinant button");
    if (determinantBtn) {
      determinantBtn.addEventListener("click", () => {
        const matrix = getMatrix();
        const det = determinantMatrix(matrix);
        displayResult(`Determinan: <span>${det}</span>`);
      });
    }
  
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) { 
        if (determinantBtn) {
          determinantBtn.click();
        }
      }
    });
  });
  