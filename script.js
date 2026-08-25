// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Register Service Worker for PWA / Add to Home Screen support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('EduPro PWA Service Worker Registered:', reg.scope))
            .catch((err) => console.error('Service Worker Registration Failed:', err));
    });
}

// State Management
let selectedClass = 12;
let selectedSubject = "Physics";
let selectedChapter = "all";
let activeTab = "notes";
let paperCategory = null;
let grammarCategory = null;

// Physics 12th Chapters
const physicsChapters = {
    1: "Electric Charges and Fields",
    2: "Electrostatic Potential and Capacitance",
    3: "Current Electricity",
    4: "Moving Charges and Magnetism",
    5: "Magnetism and Matter",
    6: "Electromagnetic Induction",
    7: "Alternating Current",
    8: "Electromagnetic Waves",
    9: "Ray Optics and Optical Instruments",
    10: "Wave Optics",
    11: "Dual Nature of Radiation and Matter",
    12: "Atoms",
    13: "Nuclei",
    14: "Semiconductor Electronics"
};

const subjectData = {
    "high": ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
    "mid": ["Science", "Mathematics", "Social Studies", "English", "Hindi"],
    "primary": ["EVS", "Mathematics", "English", "Hindi"]
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    renderClasses();
    renderSubjects();
    renderChapters();
    renderContent();
});

// Modal Controls
function openModal(modalId) { 
    document.getElementById(modalId).classList.add('active'); 
}

function closeModal(modalId) { 
    document.getElementById(modalId).classList.remove('active'); 
}

// Render Classes
function renderClasses() {
    const container = document.getElementById('classList');
    if(!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.innerText = `Class ${i}`;
        item.onclick = () => selectClass(i);
        container.appendChild(item);
    }
}

// Select Class
function selectClass(classNum) {
    selectedClass = classNum;
    document.getElementById('selectedClassText').innerText = `Class ${classNum}`;
    closeModal('classModal');
    
    renderSubjects();
    const subjects = getSubjectsForClass(classNum);
    selectedSubject = subjects[0];
    document.getElementById('selectedSubjectText').innerText = selectedSubject;
    
    selectedChapter = (selectedClass === 12 && selectedSubject === "Physics") ? "all" : 1;
    renderChapters();
    updateChapterText();

    renderContent();
}

function getSubjectsForClass(cls) {
    if (cls >= 9) return subjectData.high;
    if (cls >= 6) return subjectData.mid;
    return subjectData.primary;
}

// Render Subjects
function renderSubjects() {
    const container = document.getElementById('subjectList');
    if(!container) return;
    container.innerHTML = '';
    const subjects = getSubjectsForClass(selectedClass);

    subjects.forEach(sub => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `<span>${sub}</span><i class="fa-solid fa-angle-right"></i>`;
        item.onclick = () => selectSubject(sub);
        container.appendChild(item);
    });
}

// Select Subject
function selectSubject(subject) {
    selectedSubject = subject;
    document.getElementById('selectedSubjectText').innerText = subject;
    closeModal('subjectModal');
    
    selectedChapter = (selectedClass === 12 && selectedSubject === "Physics") ? "all" : 1;
    renderChapters();
    updateChapterText();

    renderContent();
}

// Render Chapters
function renderChapters() {
    const container = document.getElementById('chapterList');
    if(!container) return;
    container.innerHTML = '';

    if (selectedClass === 12 && selectedSubject === "Physics") {
        const allItem = document.createElement('div');
        allItem.className = 'list-item';
        allItem.style.background = 'rgba(139, 92, 246, 0.2)';
        allItem.style.border = '1px solid var(--accent-purple)';
        allItem.innerHTML = `<span style="font-weight:700; color:#a78bfa;"><i class="fa-solid fa-file-pdf"></i> All Chapters Combined PDF</span><i class="fa-solid fa-angle-right"></i>`;
        allItem.onclick = () => selectChapter("all");
        container.appendChild(allItem);
    }

    for (let ch = 1; ch <= 14; ch++) {
        const item = document.createElement('div');
        item.className = 'list-item';
        let chTitle = (selectedClass === 12 && selectedSubject === "Physics") 
                      ? physicsChapters[ch] 
                      : `Chapter ${ch}`;

        item.innerHTML = `<span>Ch ${ch}: ${chTitle}</span><i class="fa-solid fa-angle-right"></i>`;
        item.onclick = () => selectChapter(ch);
        container.appendChild(item);
    }
}

// Select Chapter
function selectChapter(chNum) {
    selectedChapter = chNum;
    updateChapterText();
    closeModal('chapterModal');
    renderContent();
}

function updateChapterText() {
    if (selectedChapter === "all") {
        document.getElementById('selectedChapterText').innerText = "All Chapters";
    } else {
        document.getElementById('selectedChapterText').innerText = `Chapter ${selectedChapter}`;
    }
}

// Switch Category Tabs
function switchTab(tabName, element) {
    activeTab = tabName;
    paperCategory = null;
    grammarCategory = null;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    renderContent();
}

// Set Paper Sub-Category
function selectPaperSubCategory(cat) {
    paperCategory = cat;
    renderContent();
}

// Set Grammar Sub-Category
function selectGrammarSubCategory(cat) {
    grammarCategory = cat;
    renderContent();
}

// Dynamic Content Render
function renderContent() {
    const container = document.getElementById('materialList');
    const heading = document.getElementById('contentHeading');
    const badge = document.getElementById('contentTypeBadge');

    if (!container) return;
    badge.innerText = activeTab.toUpperCase();

    // PAPERS TAB
    if (activeTab === "papers") {
        heading.innerText = `Class ${selectedClass} - ${selectedSubject} : Papers & Question Bank`;

        if (!paperCategory) {
            container.innerHTML = `
                <div class="sub-options-grid">
                    <div class="sub-option-card" onclick="selectPaperSubCategory('previous')">
                        <div class="sub-icon"><i class="fa-solid fa-paste"></i></div>
                        <div class="sub-info">
                            <h3>Previous Question Papers</h3>
                            <p>Board Papers from 2020 to 2025</p>
                        </div>
                        <i class="fa-solid fa-chevron-right arrow-icon"></i>
                    </div>

                    <div class="sub-option-card" onclick="selectPaperSubCategory('ot')">
                        <div class="sub-icon ot-icon"><i class="fa-solid fa-list-check"></i></div>
                        <div class="sub-info">
                            <h3>Objective Questions (OT)</h3>
                            <p>4 Options MCQs & One Word Questions</p>
                        </div>
                        <i class="fa-solid fa-chevron-right arrow-icon"></i>
                    </div>
                </div>
            `;
            return;
        }

        if (paperCategory === 'previous') {
            const previousPapers = [
                { name: `${selectedSubject} Question Paper 2020`, file: "12physicsbo20.pdf", year: "2020" },
                { name: `${selectedSubject} Question Paper 2021`, file: `${selectedSubject.toLowerCase()}_2021.pdf`, year: "2021" },
                { name: `${selectedSubject} Question Paper 2022`, file: `${selectedSubject.toLowerCase()}_2022.pdf`, year: "2022" },
                { name: `${selectedSubject} Question Paper 2023`, file: `${selectedSubject.toLowerCase()}_2023.pdf`, year: "2023" },
                { name: `${selectedSubject} Question Paper 2024`, file: `${selectedSubject.toLowerCase()}_2024.pdf`, year: "2024" },
                { name: `${selectedSubject} Question Paper 2025`, file: `${selectedSubject.toLowerCase()}_2025.pdf`, year: "2025" }
            ];

            container.innerHTML = `
                <div style="margin-bottom: 12px;">
                    <button class="back-btn" onclick="selectPaperSubCategory(null)">
                        <i class="fa-solid fa-arrow-left"></i> Back to Options
                    </button>
                </div>
            `;

            previousPapers.forEach(item => {
                const card = createMaterialCard(item.name, item.file, `Board Exam ${item.year}`, "Verified Board Paper");
                container.appendChild(card);
            });
            return;
        }

        if (paperCategory === 'ot') {
            const otItems = [
                { name: `${selectedSubject} Important OT / MCQs Bank`, file: `${selectedSubject.toLowerCase()}_ot_bank.pdf` },
                { name: `${selectedSubject} Chapterwise OT Questions`, file: `${selectedSubject.toLowerCase()}_ot_chapterwise.pdf` }
            ];

            container.innerHTML = `
                <div style="margin-bottom: 12px;">
                    <button class="back-btn" onclick="selectPaperSubCategory(null)">
                        <i class="fa-solid fa-arrow-left"></i> Back to Options
                    </button>
                </div>
            `;

            otItems.forEach(item => {
                const card = createMaterialCard(item.name, item.file, "MCQ Practice", "4-Option Questions");
                container.appendChild(card);
            });
            return;
        }
    }

    // OTHERS TAB (GRAMMAR SECTION)
    if (activeTab === "others") {
        heading.innerText = `Grammar & Additional Resources`;

        if (!grammarCategory) {
            container.innerHTML = `
                <div class="sub-options-grid">
                    <div class="sub-option-card" onclick="selectGrammarSubCategory('english_grammar')">
                        <div class="sub-icon english-icon"><i class="fa-solid fa-language"></i></div>
                        <div class="sub-info">
                            <h3>English Grammar</h3>
                            <p>Narration, Articles, Clauses, Determiners & Rules</p>
                        </div>
                        <i class="fa-solid fa-chevron-right arrow-icon"></i>
                    </div>

                    <div class="sub-option-card" onclick="selectGrammarSubCategory('hindi_grammar')">
                        <div class="sub-icon hindi-icon"><i class="fa-solid fa-book"></i></div>
                        <div class="sub-info">
                            <h3>Hindi Grammar (हिंदी व्याकरण)</h3>
                            <p>संधी, समास, अलंकार, रस, छन्द व मुहावरे</p>
                        </div>
                        <i class="fa-solid fa-chevron-right arrow-icon"></i>
                    </div>
                </div>
            `;
            return;
        }

        if (grammarCategory === 'english_grammar') {
            const englishGrammarList = [
                { name: "English Grammar: Narration Complete Rules", file: "narration.pdf", desc: "Direct & Indirect Speech" },
                { name: "English Grammar: Articles (A, An, The)", file: "Articles.pdf", desc: "Rules and Uses with Examples" },
                { name: "English Grammar: Clauses Notes", file: "Clauses.pdf", desc: "Noun, Adjective & Adverb Clauses" },
                { name: "English Grammar: Determiners PDF", file: "determiners.pdf", desc: "Types & Important Examples" }
            ];

            container.innerHTML = `
                <div style="margin-bottom: 12px;">
                    <button class="back-btn" onclick="selectGrammarSubCategory(null)">
                        <i class="fa-solid fa-arrow-left"></i> Back to Grammar Options
                    </button>
                </div>
            `;

            englishGrammarList.forEach(item => {
                const card = createMaterialCard(item.name, item.file, item.desc, "Grammar Concept PDF");
                container.appendChild(card);
            });
            return;
        }

        if (grammarCategory === 'hindi_grammar') {
            const hindiGrammarList = [
                { name: "हिंदी व्याकरण: संधि एवं समास (Sandhi & Samas)", file: "hindi_sandhi_samas.pdf", desc: "सम्पूर्ण नियम व उदाहरण" },
                { name: "हिंदी व्याकरण: अलंकार एवं रस (Alankar & Ras)", file: "hindi_alankar_ras.pdf", desc: "परिभाषा व महत्वपूर्ण प्रश्न" }
            ];

            container.innerHTML = `
                <div style="margin-bottom: 12px;">
                    <button class="back-btn" onclick="selectGrammarSubCategory(null)">
                        <i class="fa-solid fa-arrow-left"></i> Back to Grammar Options
                    </button>
                </div>
            `;

            hindiGrammarList.forEach(item => {
                const card = createMaterialCard(item.name, item.file, item.desc, "Hindi Vyakaran PDF");
                container.appendChild(card);
            });
            return;
        }
    }

    // DEFAULT NOTES TAB
    let pdfFileName = "";
    let pdfTitle = "";

    if (selectedChapter === "all") {
        heading.innerText = `Class ${selectedClass} - ${selectedSubject} : All Chapters PDF`;
        pdfFileName = "physics_allchapters.pdf"; 
        pdfTitle = `${selectedSubject} Complete Book / All Chapters PDF`;
    } else {
        let chName = (selectedClass === 12 && selectedSubject === "Physics") 
                     ? physicsChapters[selectedChapter] 
                     : `Chapter ${selectedChapter}`;

        heading.innerText = `Class ${selectedClass} - ${selectedSubject} : Chapter ${selectedChapter}`;
        pdfFileName = `${selectedSubject.toLowerCase()}_ch${selectedChapter}.pdf`;
        pdfTitle = `${selectedSubject} Ch-${selectedChapter}: ${chName}`;
    }

    container.innerHTML = '';
    const card = createMaterialCard(pdfTitle, pdfFileName, "Full Study Material", "Verified PDF Document");
    container.appendChild(card);
}

// Helper Function to Create Material Cards
function createMaterialCard(title, file, dateText, sizeText) {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.innerHTML = `
        <div class="mat-info">
            <div class="mat-icon">
                <i class="fa-solid fa-file-pdf"></i>
            </div>
            <div class="mat-details">
                <h4>${title}</h4>
                <p><i class="fa-regular fa-clock"></i> ${dateText} • ${sizeText}</p>
            </div>
        </div>
        <div class="action-btns">
            <button onclick="viewPdfCanvas('${file}', '${title}')" class="view-btn">
                <i class="fa-solid fa-eye"></i> Read Online
            </button>
            <a href="./${file}" download="${file}" class="download-btn">
                <i class="fa-solid fa-download"></i> Download PDF
            </a>
        </div>
    `;
    return card;
}

// OPTIMIZED & HIGH-CLARITY (SMOOTH SCROLLING) PDF VIEWER
async function viewPdfCanvas(pdfUrl, pdfName) {
    const container = document.getElementById('pdfContainer');
    const title = document.getElementById('pdfViewerTitle');
    
    if (title) title.innerText = pdfName;
    container.innerHTML = `
        <div id="pdfLoading" class="pdf-loading">
            <i class="fa-solid fa-spinner fa-spin"></i> Loading PDF...
        </div>
    `;
    
    openModal('pdfViewerModal');

    try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        container.innerHTML = ''; 

        // Scale 2.0 provides 2K HD Clarity without causing scroll lag
        const scale = 2.0;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: scale });
            
            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-page-canvas';
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            container.appendChild(canvas);

            // Render page asynchronously with sharp font context
            page.render({
                canvasContext: context,
                viewport: viewport
            });
        }

    } catch (error) {
        console.error("PDF Render Error: ", error);
        container.innerHTML = `
            <div style="color: #ef4444; padding: 2rem; text-align: center;">
                <i class="fa-solid fa-triangle-exclamation fa-2x"></i><br><br>
                <strong>PDF लोड करने में समस्या आई।</strong><br>
                कृपया इसे सीधे "Download PDF" बटन से डाउनलोड करें।
            </div>
        `;
    }
}
