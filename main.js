// Collect Used Variables

// Inputs
let titleInp = document.querySelector("#title_product");
let priceInp = document.querySelector("#price_product");
let taxesInp = document.querySelector("#taxes_product");
let adsInp = document.querySelector("#ads_product");
let discountInp = document.querySelector("#discount_product");
let countInp = document.querySelector("#count_product");
let categoryInp = document.querySelector("#category_product");
let searchInp = document.querySelector("#search_product");

// Buttons
let createBtn = document.querySelector("#btn-create");
let searchTitleBtn = document.querySelector("#btn_search_title");
let searchCategoryBtn = document.querySelector("#btn_search_category");
let deleteAllBtn = document.querySelector("#btn_delete_all");

// Total Price Of product
let totalPrice = document.querySelector("#total_price");
// Total Number Of product
let productNum = document.querySelector("#product_number");

// Set Toast To The App
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

let finalPrice = () => {
  if (priceInp.value != "") {
    let priceVal = Number(priceInp.value) || 0;
    let taxesVal = Number(taxesInp.value) || 0;
    let adsVal = Number(adsInp.value) || 0;
    let discountVal = Number(discountInp.value) || 0;
    let calcPrice = priceVal + taxesVal + adsVal - discountVal;
    totalPrice.textContent = calcPrice;
  } else {
    totalPrice.textContent = "";
    Toast.fire({
      icon: "error",
      title: "Price must be added",
    });
  }
};

let productArr;
if (localStorage.product) {
  productArr = JSON.parse(localStorage.product);
} else {
  productArr = [];
}

let createProduct = () => {
  // Create Object Of Product
  let productObj = {
    title: titleInp.value,
    price: priceInp.value,
    taxes: taxesInp.value,
    ads: adsInp.value,
    discount: discountInp.value,
    count: countInp.value,
    category: categoryInp.value,
  };

  if(productObj.count > 1) {
    for(let i = 0; i < productObj.count; i++) {
      // Rebate Product And Add To The Array
      productArr.push(productObj);
    }
  } else {
    // Add Product To The Array
    productArr.push(productObj);
  }

  // Add Product To The LocalStorage
  localStorage.setItem("product", JSON.stringify(productArr));
};

let clearInputs = () => {
  titleInp.value = "";
  priceInp.value = "";
  taxesInp.value = "";
  adsInp.value = "";
  discountInp.value = "";
  countInp.value = "";
  categoryInp.value = "";
  totalPrice.textContent = "";
};

let viewProduct = () => {
  // Set Products To The Table
  let tbody = "";
  if (productArr.length > 0) {
    productArr.forEach((ele, index) => {
      tbody += `
        <tr>
          <td>${(index += 1)}</td>
          <td>${ele.title}</td>
          <td>${ele.price}</td>
          <td>${ele.taxes}</td>
          <td>${ele.ads}</td>
          <td>${ele.discount}</td>
          <td>${ele.count}</td>
          <td>${ele.category}</td>
          <td>
            <button class="btn btn-sm btn-info">Update</button>
          </td>
          <td>
            <button class="btn btn-sm btn-danger" onclick='deletePro(${index})'>Delete</button>
          </td>
        </tr>
        `;
    });
    productNum.textContent = productArr.length;
    deleteAllBtn.style.display = "block";
    
  } else {
    tbody = `
    <tr>
      <td colspan="12">There's No Product</td>
    </tr>
    `;
    deleteAllBtn.style.display = "none";
  }
  document.querySelector("#product-tbody").innerHTML = tbody;
};

// Run view Product Function
viewProduct();

// Delete Product
let deletePro = (i) => {
  // Delete The Product From The Array
  productArr.splice(--i, 1);
  // Update The localStorage Products
  localStorage.product = JSON.stringify(productArr);
  // Run view Product Function
  viewProduct();
};

// Delete All Products
let deleteAllPro = () => {
  // Delete The All Product From The Array
  productArr.splice(0);
  // Delete The localStorage Products Kye
  localStorage.removeItem("product");
  // Run view Product Function
  viewProduct();
};

// Run Create Product Function
createBtn.addEventListener("click", () => {
  // Run Create Product Function
  createProduct();
  // Run Clear Inputs Function
  clearInputs();
  // Run view Product Function
  viewProduct();
});
