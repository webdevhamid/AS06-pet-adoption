const modal = document.querySelector("#modalOpen");
const modalContainer = document.querySelector("#modal-content");
const spinner = document.querySelector(".loader");
const petCard = document.querySelector("#pet-card");
const cardContainer = document.querySelector("#card-container");
const categoryNotFound = document.querySelector("#category-not-found");
const cardWrapper = document.querySelector("#card-wrapper");

// Load all the categories
const loadCategories = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/peddy/categories");
    const data = await res.json();
    //   console.log(data);
    displayCategories(data.categories);
  } catch (err) {
    console.log(err);
  }
};
loadCategories();

// Load all the pets data
const loadAllPets = async () => {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pets`);
    const data = await res.json();
    //   console.log(data);
    displayPets(data.pets);
  } catch (err) {
    console.log(err);
  }
};
loadAllPets();

// Remove all the category active button
const removeActiveClass = () => {
  const allCategoryBtns = document.querySelectorAll(".category-btn");

  allCategoryBtns.forEach((button) => {
    button.classList.remove("active");
  });
};

// Load pets data based on category button
const loadPetsCategory = async (id) => {
  try {
    displaySpinner();

    // Remove active class from all buttons
    removeActiveClass();

    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${id}`);
    const data = await res.json();

    setTimeout(() => {
      spinner.classList.add("hidden");
      petCard.classList.remove("hidden");

      displayPets(data.data);
    }, 2000);

    // Active the current button on click
    const categoryBtn = document.querySelector(`#btn-${id}`);
    categoryBtn.classList.add("active");
  } catch (err) {
    console.log(err);
  }
};

// {
//     "id": 1,
//     "category": "Cat",
//     "category_icon": "https://i.ibb.co.com/N7dM2K1/cat.png"
// },

// Render the categories button dynamically
const displayCategories = (categories) => {
  const categoryContainer = document.querySelector("#category-container");
  //   console.log(categories);

  categories.forEach((category) => {
    console.log(category);
    // console.log(category);
    const categoryItem = document.createElement("div");

    categoryItem.innerHTML = `
    <div class="flex items-center gap-4 p-6 border justify-center rounded-2xl cursor-pointer hover:bg-[#0E7A811A] transition category-btn" onclick="loadPetsCategory('${category.category}')" id="btn-${category.category}">
        <img src="${category.category_icon}" class="h-[50px]" alt="${category.category}" />
        <span class="font-extrabold text-2xl">${category.category}s</span>
    </div>
    `;

    categoryContainer.appendChild(categoryItem);
  });
};

// Load pets data by ID
const loadPetById = async (petId) => {
  const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
  const data = await res.json();
  // console.log(data.petData);
  displayLikedPet(data.petData);
};

// Render the pet liked thumbnail
const displayLikedPet = (pet) => {
  const likedContainer = document.getElementById("liked-container");
  const petImage = `
    <div class="h-[120px] rounded-lg overflow-hidden">
    <img src="${pet.image}" class="h-full object-cover">
    </div>
  `;
  likedContainer.insertAdjacentHTML("beforeend", petImage);
  console.log(pet.image);
};

// Load the pets details
const loadDetails = async (petId) => {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
    const data = await res.json();
    console.log(data.petData);

    displayDetails(data.petData);
  } catch (err) {
    console.log(err);
  }
};

// Render the pet details on the modal on click
const displayDetails = (pet) => {
  modalContainer.innerHTML = `
  <img src=${pet.image} class="h-[250px] w-full object-cover rounded-xl">
    <h2 class="text-xl font-extrabold my-2">${pet.pet_name}</h2>
   <ul class="text-gray-color font-semibold text-base grid grid-cols-2 gap-2">
              <li class="flex items-center gap-3">
                <img src=${"images/category-icons/breed.png"}>
                <span>Breed: ${!pet.breed ? "Not available" : pet.breed}</span>
              </li>
              <li class="flex items-center gap-3">
               <img src=${"images/category-icons/birth.png"}>
              <span>Birth: ${!pet.date_of_birth ? "Not available" : pet.date_of_birth}</span>
              </li>
              <li class="flex items-center gap-3">
               <img src=${"images/category-icons/gender.png"}>
              <span>Vaccinated Status: ${
                !pet.vaccinated_status ? "Not available" : pet.vaccinated_status
              }</span>
              </li>
              <li class="flex items-center gap-3">
              <img src=${"images/category-icons/gender.png"}>
              <span>Gender: ${!pet.gender ? "Not available" : pet.gender}</span>
              </li>
              <li class="flex items-center gap-3">
               <img src=${"images/category-icons/price.png"}>
              <span>Price: ${!pet.price ? "Not available" : "$" + pet.price}</span>
              </li>
          </ul>
          <div class="divider"></div>
          <div>
          <h2 class="font-extrabold text-lg">Details Information</h2>
          <p class="text-gray-color text-base mt-2">${pet.pet_details}</p>
          </div>
  `;
  modal.showModal();
};

// Adoption Countdown timer
const adoptionCountDown = (petId) => {
  const labelCountDown = document.querySelector("#countDownLabel");
  const labelAdoptionButton = document.querySelector(`#btn-${petId}`);
  const closeModal = document.querySelector("#close-modal");

  let count = 3;
  const countDown = () => {
    count--;
    labelCountDown.textContent = count;

    if (count === 0) {
      clearInterval(timer);
      labelAdoptionButton.textContent = "Adopted";
      labelAdoptionButton.setAttribute("disabled", true);
      closeModal.click();
    }
  };
  const timer = setInterval(countDown, 1000);
};

// Open the modal on click to adopt button
const openAdoptionModal = (petId) => {
  modalContainer.innerHTML = `
    <h1 class="text-3xl font-[900] text-center">Congrates!</h1>
    <p class="text-xl text-center mt-2">Adoption process is start for your pet...</p>
    <h1 class="text-7xl font-[900] text-center mt-2" id="countDownLabel">3</h1>
  `;
  modal.showModal();

  adoptionCountDown(petId);
};

// {
// "petId": 1,
// "breed": "Golden Retriever",
// "category": "Dog",
// "date_of_birth": "2023-01-15",
// "price": 1200,
// "image": "https://i.ibb.co.com/p0w744T/pet-1.jpg",
// "gender": "Male",
// "pet_details": "This friendly male Golden Retriever is energetic and loyal, making him a perfect companion for families. Born on January 15, 2023, he enjoys playing outdoors and is especially great with children. Fully vaccinated, he's ready to join your family and bring endless joy. Priced at $1200, he offers love, loyalty, and a lively spirit for those seeking a playful yet gentle dog.",
// "vaccinated_status": "Fully",
// "pet_name": "Sunny"
// },

// Render spinner
const displaySpinner = () => {
  // Render the spinner
  spinner.classList.remove("hidden");
  petCard.classList.add("hidden");
};

// Render all the pets data
const displayPets = (pets) => {
  cardContainer.innerHTML = "";

  if (pets.length === 0) {
    cardContainer.classList.add("hidden");
    categoryNotFound.classList.remove("hidden");
    return;
  } else {
    cardContainer.classList.remove("hidden");
    categoryNotFound.classList.add("hidden");
  }

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.classList = "border p-5 rounded-xl";

    card.innerHTML = `
     <img src="${
       pet.image
     }" class="w-full h-[180px] object-cover rounded-lg overflow-hidden" alt="" />
          <h2 class="text-xl font-extrabold my-2">${pet.pet_name}</h2>
          <ul class="text-gray-color font-semibold text-base flex flex-col gap-1">
              <li class="flex items-center gap-3">
                <img src=${"images/category-icons/breed.png"}>
                <span>Breed: ${!pet.breed ? "Not available" : pet.breed}</span>
              </li>
              <li class="flex items-center gap-3">
               <img src=${"images/category-icons/birth.png"}>
              <span>Birth: ${!pet.date_of_birth ? "Not available" : pet.date_of_birth}</span>
              </li>
              <li class="flex items-center gap-3">
               <img src=${"images/category-icons/gender.png"}>
              <span>Gender: ${!pet.gender ? "Not available" : pet.gender}</span>
              </li>
              <li class="flex items-center gap-3">
               <img src=${"images/category-icons/price.png"}>
              <span>Price: ${!pet.price ? "Not available" : "$" + pet.price}</span>
              </li>
          </ul>
          <div class="divider"></div>
          <div class="flex justify-between">
              <button class="border py-2 px-2 lg:px-3 rounded-lg  text-sm md:text-base" onclick="loadPetById('${
                pet.petId
              }')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                </svg>
              </button>
              <button class="border py-2 px-2 lg:px-3 rounded-lg text-primary-color font-semibold  text-sm md:text-base" onclick="openAdoptionModal('${
                pet.petId
              }')" id='btn-${pet.petId}'>Adopt</button>
              <button class="border py-2 px-2 lg:px-3 rounded-lg text-primary-color font-semibold text-sm md:text-base" onclick="loadDetails('${
                pet.petId
              }')">Details</button>
          </div>
      `;

    cardContainer.appendChild(card);
  });
};
