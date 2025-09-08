
//LOAD THE DATA IN JSON//
fetch("projects.json")
    .then(response => response.json())
    .then(projects => {
        console.log(projects);

        projects.forEach(project => {
            console.log(project.title);

            const newItem = document.createElement("a");
            newItem.classList.add(`item`, `item-${project.id}`);
            newItem.href = project.link;
            newItem.target = "_blank";

            const thumbnailContainer = document.createElement("div");
            thumbnailContainer.classList.add("thumbnail-container");

            const thumbnail = document.createElement("img");
            thumbnail.classList.add("thumbnail");
            thumbnail.src = project.image || "";
            thumbnail.alt = project.title;

            thumbnailContainer.appendChild(thumbnail);

            const projectLabel = document.createElement("div");
            projectLabel.classList.add("project");
            projectLabel.textContent = project.title;

            const projectDate = document.createElement("div");
            projectDate.classList.add("date");
            projectDate.textContent = project.date;


            newItem.appendChild(thumbnailContainer);
            newItem.appendChild(projectLabel);   
            newItem.appendChild(projectDate);   
            
            gridContainer.appendChild(newItem);
           
        });
    });


const uploadBtn = document.getElementById("upload");
const buttonBox = document.querySelector(".button-box");
const iconBtn = document.querySelector(".fa-plus");

const minimizeBtn = document.getElementById("minimize");
const uploadBox = document.querySelector(".upload-box");



const submitBtn = document.getElementById("submit");

const gridContainer = document.querySelector(".grid");

//OPEN UPLOAD FORM//
uploadBtn.addEventListener("click", () => {
    buttonBox.style.display = "none";
    uploadBox.classList.add("open");
});

minimizeBtn.addEventListener("click", () => {
    uploadBox.classList.remove("open");
    
    const onTransitionEnd = (e) => {
        if (e.propertyName === "width") {
            buttonBox.style.display = "block";

            uploadBox.removeEventListener("transitionend", onTransitionEnd);

        }
    };

    uploadBox.addEventListener("transitionend", onTransitionEnd);
});

const thumbnail = document.getElementById("imgThumbnail");
const input = document.getElementById("image_form");

input.addEventListener("change", () => {
    if (thumbnail.src === ""){
        thumbnail.style.display = "none";
    }
    else{
        thumbnail.src = URL.createObjectURL(input.files[0]);
        thumbnail.style.display = "block"
    }
});



//SUBMIT UPLOAD//
let counter = document.querySelectorAll(".grid .item").length;

submitBtn.addEventListener("click", () => {
    const newItem = document.createElement("a");
    newItem.classList.add(`item`, `item-${++counter}`);
    newItem.href = "";
    newItem.target = "_blank";

    const thumbnailContainer = document.createElement("div");
    thumbnailContainer.classList.add("thumbnail-container");
    
    const thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnail.src = "thumbnails/placeholder.png";
    thumbnail.alt = "project";

    thumbnailContainer.appendChild(thumbnail);
    
    const weekLabel = document.createElement("div");
    weekLabel.classList.add("project");
    weekLabel.textContent = "PLACEHOLDER TITLE";
    
    const projectDate = document.createElement("div");
    projectDate.classList.add("date");
    projectDate.textContent = "0000-00-00";
    
    newItem.appendChild(thumbnailContainer);
    newItem.appendChild(weekLabel);
    newItem.appendChild(projectDate);   
    
    // newItem.innerHTML = `
    //     <img class="thumbnail" src="" alt="project">
    //     <div class="week">WEEK #${counter}</div>
    // `;
    
    gridContainer.appendChild(newItem);

});

//FILL IN DATES//
function populateDateFields(monthId, dayId, yearId) {
    const monthSelect = document.getElementById(monthId);
    const daySelect = document.getElementById(dayId);
    const yearSelect = document.getElementById(yearId);

    monthSelect.innerHTML = "";
    daySelect.innerHTML = "";
    yearSelect.innerHTML = "";


    const months = ["mm","01","02","03","04","05","06","07","08","09","10","11","12"];
    months.forEach((m, i) => {
        const option = document.createElement("option");
        option.value = i === 0 ? "" : m;
        option.textContent = m;
        option.disabled = i === 0;  
        option.selected = i === 0;  
        monthSelect.appendChild(option);
    });


    const currentYear = new Date().getFullYear();
    const years = ["yyyy"];
    for (let y = currentYear + 5; y >= 1980; y--) {
        years.push(y);
    }
    years.forEach((y, i) => {
        const option = document.createElement("option");
        option.value = i === 0 ? "" : y;
        option.textContent = y;
        option.disabled = i === 0;
        option.selected = i === 0;
        yearSelect.appendChild(option);
    });

    function resetDays() {
        daySelect.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "dd";
        placeholder.disabled = true;
        placeholder.selected = true;
        daySelect.appendChild(placeholder);
    }

    resetDays();

    function updateDays() {
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);
        const daysInMonth = new Date(year || 2024, month, 0).getDate();

        for (let d = 1; d <= daysInMonth; d++) {
            const option = document.createElement("option");
            option.value = d.toString().padStart(2, "0");
            option.textContent = d.toString().padStart(2, "0");
            daySelect.appendChild(option);
        }
    }

    monthSelect.addEventListener("change", updateDays);
    yearSelect.addEventListener("change", updateDays);
}

document.addEventListener("DOMContentLoaded", () => {
    populateDateFields("created_month", "created_day", "created_year");
    populateDateFields("completed_month", "completed_day", "completed_year");
});
