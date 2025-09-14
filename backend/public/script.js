
//LOAD THE DATA IN JSON//
function fetchProject(){
    fetch("/projects")
        .then(response => response.json())
        .then(projects => {
            console.log(projects);
    
            projects.forEach(project => {
                console.log(project.title);
    
                const newItem = document.createElement("a");
                newItem.classList.add(`item`, `item-${project._id}`);
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
                projectDate.textContent = project.date_created + (" | — | ") + project.date_completed;
    
    
                newItem.appendChild(thumbnailContainer);
                newItem.appendChild(projectLabel);   
                newItem.appendChild(projectDate);   
                
                gridContainer.appendChild(newItem);
               
            });
        });
}

fetchProject();



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


function updatePreview(){
    const thumbnail = document.getElementById("imgThumbnail");
    const imageInput = document.getElementById("image_form");

    imageInput.addEventListener("change", () => {
        if (thumbnail.src === ""){
            thumbnail.style.display = "none";
        }
        else{
            thumbnail.src = URL.createObjectURL(imageInput.files[0]);
            thumbnail.style.display = "block"
        }
    });
}

updatePreview();

//SUBMIT UPLOAD//

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // 🔑 get token

    if (!token) {
        alert("❌ You must log in first before submitting.");
        return;
    }

    const title = document.getElementById("title_form").value;
    let link = document.getElementById("github_form").value;

    if (!/^https?:\/\//i.test(link)) {
    link = "https://" + link;
    }

    const date_created = `${document.getElementById("created_month").value}-${document.getElementById("created_day").value}-${document.getElementById("created_year").value}`;
    const date_completed = `${document.getElementById("completed_month").value}-${document.getElementById("completed_day").value}-${document.getElementById("completed_year").value}`;

    const imageInput = document.getElementById("image_form").files[0];
    let imageURL = "thumbnails/placeholder.png"; 
    let public_id = null;


    if(imageInput){
        const formData = new FormData();
        formData.append("image", imageInput);

        const uploadRes = await fetch("/upload-image", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });


        const uploadData = await uploadRes.json();
        imageURL = uploadData.url;
        public_id = uploadData.public_id;
    }

    const projectData = {
    title,
    date_created,
    date_completed,
    image: imageURL,
    public_id,  
    link
    };

    try{
        if (!title || !link || !date_created || !date_completed) {
            alert("Please fill in all required fields.");
            return;
        }
        else{
            const response = await fetch("/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <-- 🔐 here too
            },
            body: JSON.stringify(projectData)
            });
    
            const project = await response.json();
    
            const newItem = document.createElement("a");
            newItem.classList.add(`item`, `item-${project._id}`);
            newItem.href = project.link;
            newItem.target = "_blank";
    
            const thumbnailContainer = document.createElement("div");
            thumbnailContainer.classList.add("thumbnail-container");
    
            const thumbnail = document.createElement("img");
            thumbnail.classList.add("thumbnail");
            thumbnail.src = project.image;
            thumbnail.alt = project.title;
    
            thumbnailContainer.appendChild(thumbnail);
    
            const projectLabel = document.createElement("div");
            projectLabel.classList.add("project");
            projectLabel.textContent = project.title;
    
            const projectDate = document.createElement("div");
            projectDate.classList.add("date");
            projectDate.textContent = project.date_created + (" | — | ") + project.date_completed;
    
    
            newItem.appendChild(thumbnailContainer);
            newItem.appendChild(projectLabel);   
            newItem.appendChild(projectDate);   
            
            gridContainer.appendChild(newItem);
    
            document.getElementById("grid-form").reset();
            ["created_month", "created_day", "created_year", "completed_month", "completed_day", "completed_year"].forEach(id => {
                document.getElementById(id).selectedIndex = 0;
            });  

            const thumbnailPreview = document.getElementById("imgThumbnail");
            thumbnailPreview.src = "";
            thumbnailPreview.style.display = "none";

            uploadBox.classList.remove("open");
            buttonBox.style.display = "block";


        }

    }
    catch (err){
        console.error("Error adding project:", err);
        alert("Failed to add project. Check console for details.");

    }


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
