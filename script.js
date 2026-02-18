// // script.js
// import { auth, db, storage } from "./firebase.js";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { ref as dbRef, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// let currentUser = null;

// // Helper to clear all input fields and messages
// function clearAllInputs() {
//     const inputs = document.querySelectorAll('input');
//     inputs.forEach(input => input.value = '');

//     const messages = document.querySelectorAll('#loginMessage, #successMessage, #studentRecords, #allPaymentRecords');
//     messages.forEach(msg => {
//         if (msg.tagName === "DIV" || msg.tagName === "P") {
//             msg.innerHTML = '';
//         } else {
//             msg.textContent = '';
//         }
//     });
// }

// // Show registration form
// function showRegistrationForm() {
//     clearAllInputs();
//     document.getElementById('registration-section').style.display = 'block';
//     document.getElementById('login-section').style.display = 'none';
// }

// // Show login form
// function showLoginForm() {
//     clearAllInputs();
//     document.getElementById('login-section').style.display = 'block';
//     document.getElementById('registration-section').style.display = 'none';
// }

// // Register a new user
// async function register() {
//     const name = document.getElementById('name').value;
//     const rollNoOrPhone = document.getElementById('rollNoOrPhone').value;
//     const password = document.getElementById('password').value;
//     const role = document.getElementById('role').value;

//     const email = rollNoOrPhone + "@mess.com";

//     try {
//         if (role === "manager") {
//             const snapshot = await get(dbRef(db, 'users'));
//             const allUsers = snapshot.val() || {};
//             const managerExists = Object.values(allUsers).some(u => u.role === "manager");
//             if (managerExists) {
//                 alert("A manager is already registered. You cannot register as manager.");
//                 return;
//             }
//         }

//         const userCred = await createUserWithEmailAndPassword(auth, email, password);
//         await set(dbRef(db, 'users/' + userCred.user.uid), {
//             uid: userCred.user.uid,
//             name,
//             rollNoOrPhone,
//             role
//         });

//         alert("Registration successful!");
//         showLoginForm();
//     } catch (err) {
//         alert(err.message);
//     }
// }

// // Login user
// async function login() {
//     const rollNoOrPhone = document.getElementById('loginRollNoOrPhone').value;
//     const password = document.getElementById('loginPassword').value;
//     const role = document.getElementById('loginRole').value;

//     const email = rollNoOrPhone + "@mess.com";

//     try {
//         const userCred = await signInWithEmailAndPassword(auth, email, password);
//         const snapshot = await get(child(dbRef(db), 'users/' + userCred.user.uid));
//         currentUser = snapshot.val();

//         if (!currentUser) {
//             document.getElementById('loginMessage').textContent = "User not found";
//             return;
//         }

//         if (currentUser.role !== role) {
//             alert(`You are registered as a ${currentUser.role}. You cannot access ${role} UI.`);
//             return;
//         }

//         alert("Login successful!");

//         if (currentUser.role === "student") {
//             clearAllInputs();
//             document.getElementById('login-section').style.display = 'none';
//             document.getElementById('fee-record-section').style.display = 'block';
//         } else if (currentUser.role === "manager") {
//             clearAllInputs();
//             document.getElementById('login-section').style.display = 'none';
//             document.getElementById('manager-view-section').style.display = 'block';
//             displayAllPaymentRecords();
//         }

//     } catch (err) {
//         document.getElementById('loginMessage').textContent = "Invalid login credentials";
//     }
// }

// // Save fee record
// async function saveFeeRecord() {
//     const prn = document.getElementById('prn').value;
//     const email = document.getElementById('email').value;
//     const phone = document.getElementById('phone').value;
//     const startDate = document.getElementById('startDate').value;
//     const endDate = document.getElementById('endDate').value;
//     const amount = document.getElementById('amount').value;
//     const gpayId = document.getElementById('gpayId').value;
//     const gpayScreenshot = document.getElementById('gpayScreenshot').files[0];

//     if (!gpayScreenshot) {
//         alert("Please upload the Google Pay screenshot.");
//         return;
//     }

//     // ✅ ONLY FIX: Image → Base64 (≤ 500 KB)
//     if (gpayScreenshot.size > 500 * 1024) {
//         alert("Image size must be less than 500 KB.");
//         return;
//     }

//     const reader = new FileReader();
//     reader.onload = async function () {
//         const screenshotURL = reader.result; // Base64 string (name kept same)

//         const feeRef = push(dbRef(db, 'fees'));
//         await set(feeRef, {
//             uid: currentUser.uid,
//             prn,
//             email,
//             phone,
//             startDate,
//             endDate,
//             amount,
//             gpayId,
//             screenshotURL
//         });

//         document.getElementById('successMessage').style.display = 'block';
//         setTimeout(() => {
//             document.getElementById('successMessage').style.display = 'none';
//         }, 3000);
//     };

//     reader.readAsDataURL(gpayScreenshot);
// }

// // View previous records for student
// async function viewPreviousRecords() {
//     const recordList = document.getElementById('studentRecords');
//     const snapshot = await get(dbRef(db, 'fees'));
//     const allFees = snapshot.val() || {};

//     const studentFees = Object.values(allFees).filter(fee => fee.uid === currentUser.uid);

//     recordList.innerHTML = studentFees.map(fee => 
//         `<p>PRN: ${fee.prn}, Amount: ${fee.amount}, GPay ID: ${fee.gpayId}</p>
//          <p>Screenshot:<br><img src="${fee.screenshotURL}" width="200"/></p>`
//     ).join("");

//     document.getElementById('fee-record-section').style.display = 'none';
//     document.getElementById('student-records-section').style.display = 'block';
// }

// // Go back to fee entry
// function goBackToFeeEntry() {
//     clearAllInputs();
//     document.getElementById('student-records-section').style.display = 'none';
//     document.getElementById('fee-record-section').style.display = 'block';
// }

// // Search payments for manager
// async function searchPayments() {
//     const queryText = document.getElementById('searchQuery').value.toLowerCase().trim();
//     const paymentList = document.getElementById('allPaymentRecords');

//     const feesSnap = await get(dbRef(db, 'fees'));
//     const usersSnap = await get(dbRef(db, 'users'));
//     const fees = Object.values(feesSnap.val() || {});
//     const usersArr = Object.values(usersSnap.val() || {});

//     let html = "";
//     let found = false;

//     fees.forEach(fee => {
//         const student = usersArr.find(u => u.uid === fee.uid);
//         if (student.role === "student" && (fee.prn.toLowerCase().includes(queryText) || student.rollNoOrPhone.toLowerCase().includes(queryText))) {
//             html += `<p>Student: ${student.rollNoOrPhone}, PRN: ${fee.prn}, Amount: ${fee.amount}, GPay ID: ${fee.gpayId}</p>
//                      <img src="${fee.screenshotURL}" width="200"/><hr>`;
//             found = true;
//         }
//     });

//     paymentList.innerHTML = found ? html : "<p>No records found.</p>";
// }

// // Display all payment records for manager
// async function displayAllPaymentRecords() {
//     const paymentList = document.getElementById('allPaymentRecords');
//     const feesSnap = await get(dbRef(db, 'fees'));
//     const usersSnap = await get(dbRef(db, 'users'));
//     const fees = Object.values(feesSnap.val() || {});
//     const usersArr = Object.values(usersSnap.val() || {});

//     paymentList.innerHTML = fees.map(fee => {
//         const student = usersArr.find(u => u.uid === fee.uid);
//         return `<p>Student: ${student.rollNoOrPhone}, PRN: ${fee.prn}, Amount: ${fee.amount}, GPay ID: ${fee.gpayId}</p>
//                 <img src="${fee.screenshotURL}" width="200"/><hr>`;
//     }).join("");
// }

// // Logout
// function logout() {
//     document.getElementById('fee-record-section').style.display = 'none';
//     document.getElementById('manager-view-section').style.display = 'none';
//     document.getElementById('student-records-section').style.display = 'none';

//     currentUser = null;
//     clearAllInputs();
//     showLoginForm();
// }

// // Export functions
// window.register = register;
// window.showLoginForm = showLoginForm;
// window.showRegistrationForm = showRegistrationForm;
// window.login = login;
// window.saveFeeRecord = saveFeeRecord;
// window.viewPreviousRecords = viewPreviousRecords;
// window.goBackToFeeEntry = goBackToFeeEntry;
// window.searchPayments = searchPayments;
// window.logout = logout;

// script.js
// 

// script.js
import { auth, db, storage } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref as dbRef, set, push, get, child, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let currentUser = null;

// Helper to clear all input fields and messages
function clearAllInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');

    const messages = document.querySelectorAll('#loginMessage, #successMessage, #studentRecords, #allPaymentRecords');
    messages.forEach(msg => {
        if (msg.tagName === "DIV" || msg.tagName === "P") {
            msg.innerHTML = '';
        } else {
            msg.textContent = '';
        }
    });
}

// Show registration form
function showRegistrationForm() {
    clearAllInputs();
    document.getElementById('registration-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
}

// Show login form
function showLoginForm() {
    clearAllInputs();
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('registration-section').style.display = 'none';
}

// Register a new user
async function register() {
    const name = document.getElementById('name').value;
    const rollNoOrPhone = document.getElementById('rollNoOrPhone').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const email = rollNoOrPhone + "@mess.com";

    try {
        if (role === "manager") {
            const snapshot = await get(dbRef(db, 'users'));
            const allUsers = snapshot.val() || {};
            const managerExists = Object.values(allUsers).some(u => u.role === "manager");
            if (managerExists) {
                alert("A manager is already registered. You cannot register as manager.");
                return;
            }
        }

        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await set(dbRef(db, 'users/' + userCred.user.uid), {
            uid: userCred.user.uid,
            name,
            rollNoOrPhone,
            role
        });

        alert("Registration successful!");
        showLoginForm();
    } catch (err) {
        alert(err.message);
    }
}

// Login user
async function login() {
    const rollNoOrPhone = document.getElementById('loginRollNoOrPhone').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    const email = rollNoOrPhone + "@mess.com";

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const snapshot = await get(child(dbRef(db), 'users/' + userCred.user.uid));
        currentUser = snapshot.val();

        if (!currentUser) {
            document.getElementById('loginMessage').textContent = "User not found";
            return;
        }

        if (currentUser.role !== role) {
            alert(`You are registered as a ${currentUser.role}. You cannot access ${role} UI.`);
            return;
        }

        alert("Login successful!");

        if (currentUser.role === "student") {
            clearAllInputs();
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('fee-record-section').style.display = 'block';
        } else if (currentUser.role === "manager") {
            clearAllInputs();
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('manager-view-section').style.display = 'block';
            displayAllPaymentRecords();
        }

    } catch (err) {
        document.getElementById('loginMessage').textContent = "Invalid login credentials";
    }
}

// Save fee record
async function saveFeeRecord() {
    const prn = document.getElementById('prn').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const amount = document.getElementById('amount').value;
    const gpayId = document.getElementById('gpayId').value;
    const gpayScreenshot = document.getElementById('gpayScreenshot').files[0];

    if (!gpayScreenshot) {
        alert("Please upload the Google Pay screenshot.");
        return;
    }

    if (gpayScreenshot.size > 500 * 1024) {
        alert("Image size must be less than 500 KB.");
        return;
    }

    // Check for duplicates: same student and same GPay ID
    const snapshot = await get(dbRef(db, 'fees'));
    const allFees = snapshot.val() || {};
    const duplicate = Object.values(allFees).some(fee => fee.uid === currentUser.uid && fee.gpayId === gpayId);
    if (duplicate) {
        alert("Record already exists with this GPay ID. Cannot upload duplicate.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
        const screenshotURL = reader.result; // Base64 string

        const feeRef = push(dbRef(db, 'fees'));
        await set(feeRef, {
            uid: currentUser.uid,
            prn,
            email,
            phone,
            startDate,
            endDate,
            amount,
            gpayId,
            screenshotURL
        });

        // ✅ Show success message
        const successMsg = document.getElementById('successMessage');
        successMsg.textContent = "Information saved successfully!";
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
    };

    reader.readAsDataURL(gpayScreenshot);
}

// View previous records for student
async function viewPreviousRecords() {
    const recordList = document.getElementById('studentRecords');
    const snapshot = await get(dbRef(db, 'fees'));
    const allFees = snapshot.val() || {};

    const studentFees = Object.values(allFees).filter(fee => fee.uid === currentUser.uid);

    recordList.innerHTML = studentFees.map(fee =>
        `<p>PRN: ${fee.prn}, Amount: ${fee.amount}, GPay ID: ${fee.gpayId}</p>
         <p>Screenshot: <a href="${fee.screenshotURL}" target="_blank">View Screenshot</a></p>`
    ).join("");

    document.getElementById('fee-record-section').style.display = 'none';
    document.getElementById('student-records-section').style.display = 'block';
}

// Go back to fee entry
function goBackToFeeEntry() {
    clearAllInputs();
    document.getElementById('student-records-section').style.display = 'none';
    document.getElementById('fee-record-section').style.display = 'block';
}

// Search payments for manager
async function searchPayments() {
    const queryText = document.getElementById('searchQuery').value.toLowerCase().trim();
    const paymentList = document.getElementById('allPaymentRecords');

    const feesSnap = await get(dbRef(db, 'fees'));
    const usersSnap = await get(dbRef(db, 'users'));
    const fees = Object.values(feesSnap.val() || {});
    const usersArr = Object.values(usersSnap.val() || {});

    let html = "";
    let found = false;

    fees.forEach(fee => {
        const student = usersArr.find(u => u && u.uid === fee.uid);
        if (!student || student.role !== "student") return;

        if (fee.prn.toLowerCase().includes(queryText) || (student.rollNoOrPhone && student.rollNoOrPhone.toLowerCase().includes(queryText))) {
            html += `<p>Student: ${student.rollNoOrPhone}, PRN: ${fee.prn}, Amount: ${fee.amount}, GPay ID: ${fee.gpayId}</p>
                     <p>Screenshot: <a href="${fee.screenshotURL}" target="_blank">View Screenshot</a></p><hr>`;
            found = true;
        }
    });

    paymentList.innerHTML = found ? html : "<p>No records found.</p>";
}

// Display all payment records for manager
async function displayAllPaymentRecords() {
    const paymentList = document.getElementById('allPaymentRecords');
    const feesSnap = await get(dbRef(db, 'fees'));
    const usersSnap = await get(dbRef(db, 'users'));
    const fees = Object.values(feesSnap.val() || {});
    const usersArr = Object.values(usersSnap.val() || {});

    paymentList.innerHTML = fees.map(fee => {
        const student = usersArr.find(u => u && u.uid === fee.uid);
        if (!student || student.role !== "student") return "";
        return `<p>Student: ${student.rollNoOrPhone}, PRN: ${fee.prn}, Amount: ${fee.amount}, GPay ID: ${fee.gpayId}</p>
                <p>Screenshot: <a href="${fee.screenshotURL}" target="_blank">View Screenshot</a></p><hr>`;
    }).join("");
}

// Logout
function logout() {
    document.getElementById('fee-record-section').style.display = 'none';
    document.getElementById('manager-view-section').style.display = 'none';
    document.getElementById('student-records-section').style.display = 'none';

    currentUser = null;
    clearAllInputs();
    showLoginForm();
}

// Export functions
window.register = register;
window.showLoginForm = showLoginForm;
window.showRegistrationForm = showRegistrationForm;
window.login = login;
window.saveFeeRecord = saveFeeRecord;
window.viewPreviousRecords = viewPreviousRecords;
window.goBackToFeeEntry = goBackToFeeEntry;
window.searchPayments = searchPayments;
window.logout = logout;
