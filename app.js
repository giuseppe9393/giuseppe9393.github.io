/*
====================================================
FOSSR ORP PANEL ACCESS
app.js
====================================================
*/

let currentStep = 0;

document.addEventListener("DOMContentLoaded", () => {

    initializeWizard();
    initializeAbstractCounter();
    initializeUploads();
    initializeDraftSystem();
    initializeFormSubmission();

});

/* ==================================================
   WIZARD
================================================== */

function initializeWizard() {

    updateStep();

    const nextBtn =
        document.getElementById("nextBtn");

    const prevBtn =
        document.getElementById("prevBtn");

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            nextStep
        );
    }

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            prevStep
        );
    }
}

function nextStep() {

    if (!validateCurrentStep()) {
        return;
    }

    const steps =
        document.querySelectorAll(".step");

    if (
        currentStep <
        steps.length - 1
    ) {

        currentStep++;

        updateStep();
    }
}

function prevStep() {

    if (currentStep > 0) {

        currentStep--;

        updateStep();
    }
}

function updateStep() {

    const steps =
        document.querySelectorAll(".step");

    const progress =
        document.getElementById(
            "progressBar"
        );

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    const submitBtn =
        document.getElementById(
            "submitBtn"
        );

    steps.forEach((step, index) => {

        step.classList.remove("active");

        if (index === currentStep) {

            step.classList.add("active");
        }

    });

    const percent =
        ((currentStep + 1)
            / steps.length) * 100;

    if (progress) {

        progress.style.width =
            percent + "%";

        progress.innerText =
            `Sezione ${currentStep + 1} di ${steps.length}`;
    }

    if (
        currentStep ===
        steps.length - 1
    ) {

        buildSummary();

        nextBtn.classList.add(
            "d-none"
        );

        submitBtn.classList.remove(
            "d-none"
        );

    } else {

        nextBtn.classList.remove(
            "d-none"
        );

        submitBtn.classList.add(
            "d-none"
        );
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

/* ==================================================
   VALIDAZIONE
================================================== */

function validateCurrentStep() {

    const steps =
        document.querySelectorAll(
            ".step"
        );

    const current =
        steps[currentStep];

    let valid = true;

    const requiredFields =
        current.querySelectorAll(
            "[required]"
        );

    requiredFields.forEach(field => {

        field.classList.remove(
            "is-invalid"
        );

        if (
            field.type ===
            "checkbox"
        ) {

            if (!field.checked) {

                valid = false;

                field.classList.add(
                    "is-invalid"
                );
            }

        } else if (

            field.type ===
            "radio"

        ) {

            const checked =
                current.querySelector(
                    `input[name="${field.name}"]:checked`
                );

            if (!checked) {

                valid = false;
            }

        } else {

            if (
                field.value.trim() ===
                ""
            ) {

                valid = false;

                field.classList.add(
                    "is-invalid"
                );
            }
        }

    });

    if (!valid) {

        alert(
            "Compilare tutti i campi obbligatori."
        );
    }

    return valid;
}

/* ==================================================
   ABSTRACT COUNTER
================================================== */

function initializeAbstractCounter() {

    const abstractField =
        document.getElementById(
            "abstract"
        );

    const counter =
        document.getElementById(
            "counter"
        );

    if (
        !abstractField ||
        !counter
    ) {
        return;
    }

    function updateCounter() {

        const length =
            abstractField.value.length;

        counter.innerText =
            `${length} / 2500`;

        if (length > 2300) {

            counter.style.color =
                "#dc3545";

        } else {

            counter.style.color =
                "#6c757d";
        }
    }

    abstractField.addEventListener(
        "input",
        updateCounter
    );

    updateCounter();
}

/* ==================================================
   FILE PDF
================================================== */

function initializeUploads() {

    const files =
        document.querySelectorAll(
            'input[type="file"]'
        );

    files.forEach(input => {

        input.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];

                if (!file) {
                    return;
                }

                if (
                    file.type !==
                    "application/pdf"
                ) {

                    alert(
                        "Sono ammessi soltanto file PDF."
                    );

                    this.value = "";

                    return;
                }

                const maxSize =
                    5 * 1024 * 1024;

                if (
                    file.size >
                    maxSize
                ) {

                    alert(
                        "Dimensione massima consentita: 5 MB."
                    );

                    this.value = "";
                }

            }
        );

    });

}

/* ==================================================
   BOZZA
================================================== */

function initializeDraftSystem() {

    const saveButton =
        document.getElementById(
            "saveDraft"
        );

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveDraft
        );

    }

    loadDraft();
}

function saveDraft() {

    const fields =
        document.querySelectorAll(
            "input, textarea, select"
        );

    const draft = {};

    fields.forEach((field, index) => {

        if (
            field.type === "file"
        ) {
            return;
        }

        if (
            field.type === "checkbox"
        ) {

            draft[index] =
                field.checked;

        } else {

            draft[index] =
                field.value;
        }

    });

    draft.savedOn =
        new Date()
            .toISOString();

    localStorage.setItem(
        "orpDraft",
        JSON.stringify(draft)
    );

    alert(
        "Bozza salvata."
    );
}

function loadDraft() {

    const saved =
        localStorage.getItem(
            "orpDraft"
        );

    if (!saved) {
        return;
    }

    const draft =
        JSON.parse(saved);

    const fields =
        document.querySelectorAll(
            "input, textarea, select"
        );

    fields.forEach(
        (field, index) => {

            if (
                field.type === "file"
            ) {
                return;
            }

            if (
                draft[index] ===
                undefined
            ) {
                return;
            }

            if (
                field.type ===
                "checkbox"
            ) {

                field.checked =
                    draft[index];

            } else {

                field.value =
                    draft[index];
            }

        }
    );
}

/* ==================================================
   IDENTIFICATIVO
================================================== */

function generateRequestId() {

    const year =
        new Date()
            .getFullYear();

    let progressive =
        Number(
            localStorage.getItem(
                "orpProgressive"
            )
        );

    if (!progressive) {

        progressive = 1;

    } else {

        progressive++;
    }

    localStorage.setItem(
        "orpProgressive",
        progressive
    );

    return (
        "ORP-F1-" +
        year +
        "-" +
        String(progressive)
            .padStart(3, "0")
    );
}

/* ==================================================
   SUMMARY
================================================== */

function buildSummary() {

    const box =
        document.getElementById(
            "summaryBox"
        );

    if (!box) {
        return;
    }

    let html =
        "<h4>Riepilogo richiesta</h4>";

    const fields =
        document.querySelectorAll(
            "input[type='text'], input[type='email'], textarea"
        );

    fields.forEach(field => {

        if (
            field.value.trim() ===
            ""
        ) {
            return;
        }

        const label =
            field
                .closest(".mb-3")
                ?.querySelector(
                    "label"
                )
                ?.innerText ||
            "Campo";

        html += `
            <div class="summary-item">
                <strong>${label}</strong><br>
                ${field.value}
            </div>
        `;
    });

    box.innerHTML = html;

    box.classList.add(
        "show"
    );
}

/* ==================================================
   EXPORT JSON
================================================== */

function exportJSON() {

    const data = {};

    document
        .querySelectorAll(
            "input, textarea, select"
        )
        .forEach(
            (field, index) => {

                if (
                    field.type ===
                    "file"
                ) {
                    return;
                }

                if (
                    field.type ===
                    "checkbox"
                ) {

                    data[index] =
                        field.checked;

                } else {

                    data[index] =
                        field.value;
                }
            }
        );

    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        "ORP_Request.json";

    link.click();
}

/* ==================================================
   SUBMIT
================================================== */

function initializeFormSubmission() {

    const form =
        document.getElementById(
            "orpForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            if (
                !validateCurrentStep()
            ) {
                return;
            }

            showLoading();

            setTimeout(() => {

                const requestId =
                    generateRequestId();

                registerWorkflowT1(
                    requestId
                );

                exportJSON();

                localStorage.removeItem(
                    "orpDraft"
                );

                hideLoading();

                alert(
                    "Richiesta inviata con successo.\n\n" +
                    requestId
                );

            }, 1000);

        }
    );
}

/* ==================================================
   WORKFLOW T1
================================================== */

function registerWorkflowT1(
    requestId
) {

    const idCell =
        document.getElementById(
            "requestIdentifier"
        );

    const dateCell =
        document.getElementById(
            "t1Date"
        );

    if (idCell) {

        idCell.innerText =
            requestId;
    }

    if (dateCell) {

        dateCell.innerText =
            new Date()
                .toLocaleString(
                    "it-IT"
                );
    }
}

/* ==================================================
   LOADING
================================================== */

function showLoading() {

    const overlay =
        document.querySelector(
            ".spinner-overlay"
        );

    if (overlay) {

        overlay.classList.add(
            "show"
        );
    }
}

function hideLoading() {

    const overlay =
        document.querySelector(
            ".spinner-overlay"
        );

    if (overlay) {

        overlay.classList.remove(
            "show"
        );
    }
}