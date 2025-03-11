/**
 * GWA (General Weighted Average) Calculator
 * This script provides functionality to calculate the general weighted average
 * based on subject grades and their corresponding units.
 */

// Initialize subjects array from localStorage or as empty array
let subjects = JSON.parse(localStorage.getItem('gwaSubjects')) || [];

// DOM Elements
const subjectForm = document.getElementById('subject-form');
const subjectName = document.getElementById('subject-name');
const subjectGrade = document.getElementById('subject-grade');
const subjectUnits = document.getElementById('subject-units');
const subjectList = document.getElementById('subject-list');
const tableEmptyState = document.getElementById('table-empty-state');
const emptyState = document.getElementById('empty-state');
const resultsDisplay = document.getElementById('results-display');
const calculateGwaBtn = document.getElementById('calculate-gwa');
const resetSubjectsBtn = document.getElementById('reset-subjects');
const exportDataBtn = document.getElementById('export-data');

// Results elements
const gwaResult = document.getElementById('gwa-result');
const gwaPerformance = document.getElementById('gwa-performance');
const gwaProgressBar = document.getElementById('gwa-progress-bar');
const totalUnits = document.getElementById('total-units');
const totalSubjects = document.getElementById('total-subjects');
const adviceText = document.getElementById('advice-text');

/**
 * Add a new subject to the array and localStorage
 * @param {Object} subject - The subject object to add
 */
function addSubject(subject) {
    subjects.push(subject);
    saveSubjects();
    updateUI();
    showNotification('Subject added successfully!', 'success');
    return true;
}

/**
 * Save subjects array to localStorage
 */
function saveSubjects() {
    localStorage.setItem('gwaSubjects', JSON.stringify(subjects));
}

/**
 * Calculate GWA based on subjects array
 * @returns {number} - The calculated GWA value
 */
function calculateGWA() {
    // Condition variable: Check if subjects array is empty
    if (subjects.length === 0) {
        return 0;
    }
    
    let totalQualityPoints = 0;
    let totalUnitsValue = 0;
    
    subjects.forEach(subject => {
        // Calculate quality points for each subject (grade × units)
        totalQualityPoints += subject.qualityPoints;
        totalUnitsValue += subject.units;
    });
    
    // Condition variable: Check if total units is zero
    if (totalUnitsValue === 0) {
        return 0;
    }
    
    // Calculate GWA by dividing total quality points by total units
    const gwa = totalQualityPoints / totalUnitsValue;
    
    // Round to 2 decimal places
    return Math.round(gwa * 100) / 100;
}

/**
 * Determine performance level based on GWA
 * @param {number} gwa - The GWA value
 * @returns {Object} - Performance information
 */
function getPerformanceInfo(gwa) {
    let performance = '';
    let progressBarClass = '';
    let progressPercent = 0;
    
    // Condition variables to determine performance based on GWA range
    if (gwa >= 1.0 && gwa <= 1.25) {
        performance = "Excellent";
        progressBarClass = "bg-success";
        progressPercent = 100;
    } else if (gwa >= 1.5 && gwa <= 1.75) {
        performance = "Very Good";
        progressBarClass = "bg-primary";
        progressPercent = 85;
    } else if (gwa >= 2.0 && gwa <= 2.25) {
        performance = "Good";
        progressBarClass = "bg-info";
        progressPercent = 70;
    } else if (gwa >= 2.5 && gwa <= 2.75) {
        performance = "Satisfactory";
        progressBarClass = "bg-warning";
        progressPercent = 55;
    } else if (gwa == 3.0) {
        performance = "Passing";
        progressBarClass = "bg-warning";
        progressPercent = 40;
    } else if (gwa == 5.0) {
        performance = "Failed";
        progressBarClass = "bg-danger";
        progressPercent = 20;
    } else if (gwa > 0) {
        performance = "Invalid GWA Range";
        progressBarClass = "bg-secondary";
        progressPercent = 10;
    } else {
        performance = "No Data";
        progressBarClass = "bg-secondary";
        progressPercent = 0;
    }
    
    return { performance, progressBarClass, progressPercent };
}

/**
 * Generate advice based on GWA value
 * @param {number} gwa - The GWA value
 * @returns {string} - Advice text
 */
function generateAdvice(gwa) {
    // Condition variables to determine advice based on GWA range
    if (gwa === 0) {
        return "Add subjects to calculate your GWA.";
    } else if (gwa <= 1.25) {
        return "Outstanding performance! Keep up the excellent work!";
    } else if (gwa <= 1.75) {
        return "Very good performance! You're doing great in your studies.";
    } else if (gwa <= 2.25) {
        return "Good performance! Consider focusing more on challenging subjects.";
    } else if (gwa <= 2.75) {
        return "Satisfactory performance. Try to improve your study habits.";
    } else if (gwa === 3.0) {
        return "You're passing, but there's significant room for improvement.";
    } else if (gwa === 5.0) {
        return "Please seek academic advice and consider retaking the course.";
    } else {
        return "Your GWA is outside the standard range. Verify your grades.";
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, danger, etc.)
 */
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '1050';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Update the UI with current subjects data
 */
function updateUI() {
    // Update subject list table
    subjectList.innerHTML = '';
    
    // Condition variable: Check if subjects array is empty
    if (subjects.length === 0) {
        tableEmptyState.style.display = 'block';
    } else {
        tableEmptyState.style.display = 'none';
        
        subjects.forEach((subject, index) => {
            const row = document.createElement('tr');
            
            // Create table cells
            const indexCell = document.createElement('td');
            indexCell.textContent = index + 1;
            
            const nameCell = document.createElement('td');
            nameCell.textContent = subject.name;
            
            const gradeCell = document.createElement('td');
            gradeCell.textContent = subject.grade.toFixed(2);
            
            // Set color based on grade
            if (subject.grade <= 1.25) {
                gradeCell.classList.add('text-success', 'fw-bold');
            } else if (subject.grade <= 2.25) {
                gradeCell.classList.add('text-info', 'fw-bold');
            } else if (subject.grade <= 3.0) {
                gradeCell.classList.add('text-warning', 'fw-bold');
            } else {
                gradeCell.classList.add('text-danger', 'fw-bold');
            }
            
            const unitsCell = document.createElement('td');
            unitsCell.textContent = subject.units;
            
            const pointsCell = document.createElement('td');
            pointsCell.textContent = subject.qualityPoints.toFixed(2);
            
            const actionsCell = document.createElement('td');
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => deleteSubject(index));
            
            actionsCell.appendChild(deleteBtn);
            
            // Append cells to row
            row.appendChild(indexCell);
            row.appendChild(nameCell);
            row.appendChild(gradeCell);
            row.appendChild(unitsCell);
            row.appendChild(pointsCell);
            row.appendChild(actionsCell);
            
            // Append row to table
            subjectList.appendChild(row);
        });
    }
}

/**
 * Update the GWA results display
 */
function updateResults() {
    const gwa = calculateGWA();
    const { performance, progressBarClass, progressPercent } = getPerformanceInfo(gwa);
    const advice = generateAdvice(gwa);
    const unitsCount = subjects.reduce((sum, subject) => sum + subject.units, 0);
    
    // Condition variable: Check if subjects array is empty
    if (subjects.length === 0) {
        emptyState.style.display = 'block';
        resultsDisplay.classList.add('d-none');
    } else {
        emptyState.style.display = 'none';
        resultsDisplay.classList.remove('d-none');
        
        // Update display elements
        gwaResult.textContent = gwa.toFixed(2);
        gwaPerformance.textContent = performance;
        
        // Clear existing classes and add new ones
        gwaProgressBar.className = 'progress-bar';
        gwaProgressBar.classList.add(progressBarClass);
        gwaProgressBar.style.width = `${progressPercent}%`;
        gwaProgressBar.setAttribute('aria-valuenow', progressPercent);
        
        totalUnits.textContent = unitsCount;
        totalSubjects.textContent = subjects.length;
        adviceText.textContent = advice;
    }
}

/**
 * Delete a subject at the given index
 * @param {number} index - The index of the subject to delete
 */
function deleteSubject(index) {
    // Condition variable: Confirm deletion
    if (confirm('Are you sure you want to delete this subject?')) {
        subjects.splice(index, 1);
        saveSubjects();
        updateUI();
        updateResults();
        showNotification('Subject deleted', 'info');
    }
}

/**
 * Export subjects data as CSV
 */
function exportData() {
    // Condition variable: Check if there are subjects to export
    if (subjects.length === 0) {
        showNotification('No subjects to export', 'warning');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,Subject,Grade,Units,Quality Points\n';
    
    subjects.forEach(subject => {
        const row = [
            subject.name,
            subject.grade.toFixed(2),
            subject.units,
            subject.qualityPoints.toFixed(2)
        ].map(value => `"${value}"`).join(',');
        
        csvContent += row + '\n';
    });
    
    // Add GWA information
    csvContent += '\n"GWA","' + calculateGWA().toFixed(2) + '"';
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'gwa_data.csv');
    document.body.appendChild(link);
    
    // Trigger download and clean up
    link.click();
    document.body.removeChild(link);
}

// Event Listeners

// Add subject form submission
subjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = subjectName.value.trim();
    const grade = parseFloat(subjectGrade.value);
    const units = parseInt(subjectUnits.value);
    
    // Validate inputs
    if (!name) {
        showNotification('Subject name is required', 'danger');
        return;
    }
    
    if (isNaN(grade) || grade < 1.0 || grade > 5.0) {
        showNotification('Grade must be between 1.0 and 5.0', 'danger');
        return;
    }
    
    if (isNaN(units) || units < 1) {
        showNotification('Units must be at least 1', 'danger');
        return;
    }
    
    // Calculate quality points
    const qualityPoints = grade * units;
    
    // Create subject object
    const subject = {
        name,
        grade,
        units,
        qualityPoints
    };
    
    // Add subject
    addSubject(subject);
    
    // Reset form
    subjectForm.reset();
    subjectName.focus();
});

// Calculate GWA button
calculateGwaBtn.addEventListener('click', () => {
    // Condition variable: Check if subjects array is empty
    if (subjects.length === 0) {
        showNotification('Add subjects first to calculate GWA', 'warning');
        return;
    }
    
    updateResults();
    
    // Scroll to results
    resultsDisplay.scrollIntoView({ behavior: 'smooth' });
    
    showNotification('GWA calculated successfully!', 'success');
});

// Reset subjects button
resetSubjectsBtn.addEventListener('click', () => {
    // Condition variable: Confirm reset
    if (confirm('Are you sure you want to reset all subjects? This cannot be undone.')) {
        subjects = [];
        saveSubjects();
        updateUI();
        updateResults();
        showNotification('All subjects have been reset', 'info');
    }
});

// Export data button
exportDataBtn.addEventListener('click', exportData);

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    updateResults();
});
