document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
  
    const matrixA = document.getElementById("matrixA");
    const inputGrid = matrixA.querySelector(".input-grid");
    const resultDiv = document.querySelector("#display .result");
    const matrixSizeInput = document.getElementById("matrixSizeInput");
    const decreaseSizeBtn = document.getElementById("decreaseSize");
    const increaseSizeBtn = document.getElementById("increaseSize");
  
    // Check if matrixA, inputGrid, resultDiv, matrixSizeInput, decreaseSizeBtn, and increaseSizeBtn are found
    if (!matrixA || !inputGrid || !resultDiv || !matrixSizeInput || !decreaseSizeBtn || !increaseSizeBtn) {
      console.error("Some elements not found");
      return;
    }
  
    let matrixSize = parseInt(matrixSizeInput.value, 10); // Default matrix size
  
    // Function to create the input grid based on the size
    function createMatrixGrid(size) {
      console.log(`Creating a ${size}x${size} matrix grid`);
      matrixSize = size; // Store the matrix size
      matrixSizeInput.value = size; // Update the displayed value in the input field
      // Clear any existing grid
      inputGrid.innerHTML = '';
  
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const input = document.createElement("input");
          input.type = "text"; // Use text type to control input length
          input.classList.add("matrix-input");
          input.setAttribute("data-row", i);
          input.setAttribute("data-col", j);
  
          // Add event listener to prevent non-numeric input and limit to 2 digits (including negative sign) and range 1-10
          input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9-]/g, ''); // Remove non-numeric characters except for '-'
            if (value.includes('-')) {
                value = '-' + value.replace(/-/g, ''); // Ensure only one '-' at the beginning
            }
            // Limit to 2 characters (including negative sign if present)
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
        // Add a line break after each row
        inputGrid.appendChild(document.createElement("br"));
      }
    }
  
    // Function to randomize the input grid with numbers between -10 and 10
    function randomizeMatrixGrid() {
      const inputs = inputGrid.querySelectorAll("input.matrix-input");
      inputs.forEach(input => {
        const randomValue = Math.floor(Math.random() * 21) - 10; // Random number between -10 and 10
        input.value = randomValue;
      });
    }
  
    // Function to get the matrix from the input fields
    function getMatrix() {
      const matrix = [];
      for (let i = 0; i < matrixSize; i++) {
        const row = [];
        for (let j = 0; j < matrixSize; j++) {
          const input = inputGrid.querySelector(`input[data-row='${i}'][data-col='${j}']`);
          row.push(Number(input.value) || 0); // Convert input value to number
        }
        matrix.push(row);
      }
      return matrix;
    }
  
    // Function to display result
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
  
    // Initialize the input grid with the default size
    createMatrixGrid(matrixSize);
  
    // Event listener for the matrix size input field
    matrixSizeInput.addEventListener("change", (e) => {
      const size = parseInt(e.target.value, 10);
      if (size >= 1 && size <= 10) {
        createMatrixGrid(size);
      }
    });
  
    // Event listener for the decrease size button
    decreaseSizeBtn.addEventListener("click", () => {
      if (matrixSize > 2) {
        matrixSize--;
        matrixSizeInput.value = matrixSize; // Update the value of matrixSizeInput
        createMatrixGrid(matrixSize); // Recreate the matrix grid
        matrixSizeInput.dispatchEvent(new Event('change')); // Trigger the change event
      }
    });
  
    // Event listener for the increase size button
    increaseSizeBtn.addEventListener("click", () => {
      if (matrixSize < 10) {
        matrixSize++;
        matrixSizeInput.value = matrixSize; // Update the value of matrixSizeInput
        createMatrixGrid(matrixSize); // Recreate the matrix grid
        matrixSizeInput.dispatchEvent(new Event('change')); // Trigger the change event
      }
    });
  
    // Event listener for the reset button
    const resetBtn = matrixA.querySelector(".reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        console.log("Reset button clicked");
        const inputs = inputGrid.querySelectorAll("input.matrix-input");
        inputs.forEach(input => {
          input.value = ''; // Clear the value of each input element
        });
      });
    }
  
    // Event listener for the randomize button
    const randomizeBtn = matrixA.querySelector(".randomize-btn");
    if (randomizeBtn) {
      randomizeBtn.addEventListener("click", () => {
        console.log("Randomize button clicked");
        randomizeMatrixGrid();
      });
    }
  
    // Event listener for the determinant calculation button
    const determinantBtn = document.querySelector("#determinant button");
    if (determinantBtn) {
      determinantBtn.addEventListener("click", () => {
        const matrix = getMatrix();
        const det = determinantMatrix(matrix);
        displayResult(`Determinan: <span>${det}</span>`);
      });
    }
  
    // Event listener for Enter key press to trigger determinant calculation
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) { // Check if the pressed key is Enter
        if (determinantBtn) {
          determinantBtn.click();
        }
      }
    });
  });
  